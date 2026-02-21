/**
 * COMFORTCARE AUTHENTICATION & AUTHORIZATION SYSTEM
 * 
 * Role-Based Access Control (RBAC)
 * - Customers: No login required (public access)
 * - Agents: Login with Agent ID + PIN
 * - Admin: Login with admin credentials
 */

// ============================================================================
// USER ROLES & PERMISSIONS
// ============================================================================

const ROLES = {
  CUSTOMER: 'customer',    // No authentication needed
  AGENT: 'agent',         // Can view their orders and earnings
  ADMIN: 'admin'          // Full access to all data
};

const PERMISSIONS = {
  // Customer permissions (no login)
  'customer': [
    'view_products',
    'create_order',
    'view_own_order',
    'track_delivery'
  ],
  
  // Agent permissions
  'agent': [
    'view_assigned_orders',
    'update_order_status',
    'view_own_earnings',
    'schedule_delivery',
    'schedule_pickup',
    'view_own_stats'
  ],
  
  // Admin permissions (owner)
  'admin': [
    'view_all_orders',
    'view_all_agents',
    'view_all_customers',
    'assign_orders',
    'view_total_revenue',
    'manage_inventory',
    'manage_pricing',
    'view_analytics',
    'manage_agents',
    'view_all_earnings',
    'export_reports',
    'manage_settings'
  ]
};

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

class AuthService {
  constructor() {
    this.sessionKey = 'comcare_session';
    this.currentUser = this.loadSession();
  }

  /**
   * AGENT LOGIN
   * Authenticate agent with their ID and PIN
   */
  async loginAgent(agentId, pin) {
    try {
      const response = await fetch('/api/auth/agent-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, pin })
      });

      if (!response.ok) {
        throw new Error('Invalid agent credentials');
      }

      const data = await response.json();
      const session = {
        role: ROLES.AGENT,
        userId: data.agent.agentId,
        name: data.agent.name,
        email: data.agent.email,
        zone: data.agent.zone,
        commissionRate: data.agent.commissionRate,
        token: data.token,
        loginTime: new Date().toISOString()
      };

      this.saveSession(session);
      this.currentUser = session;
      return { success: true, user: session };

    } catch (error) {
      console.error('Agent login failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ADMIN LOGIN
   * Authenticate admin (business owner)
   */
  async loginAdmin(username, password) {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Invalid admin credentials');
      }

      const data = await response.json();
      const session = {
        role: ROLES.ADMIN,
        userId: data.admin.adminId,
        name: data.admin.name,
        email: data.admin.email,
        token: data.token,
        loginTime: new Date().toISOString()
      };

      this.saveSession(session);
      this.currentUser = session;
      return { success: true, user: session };

    } catch (error) {
      console.error('Admin login failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * LOGOUT
   * Clear session and redirect
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
    this.currentUser = null;
    
    // Redirect to home page
    window.location.href = '/index.html';
  }

  /**
   * CHECK AUTHENTICATION
   * Returns current user or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * CHECK AUTHORIZATION
   * Verify user has required permission
   */
  hasPermission(permission) {
    if (!this.currentUser) return false;
    const userPermissions = PERMISSIONS[this.currentUser.role] || [];
    return userPermissions.includes(permission);
  }

  /**
   * CHECK ROLE
   * Verify user has specific role
   */
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  /**
   * REQUIRE AUTHENTICATION
   * Redirect to login if not authenticated
   */
  requireAuth(requiredRole) {
    if (!this.currentUser) {
      // Not logged in
      this.redirectToLogin(requiredRole);
      return false;
    }

    if (requiredRole && this.currentUser.role !== requiredRole) {
      // Wrong role
      alert('Access denied. Insufficient permissions.');
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * REDIRECT TO LOGIN
   */
  redirectToLogin(role) {
    const loginPages = {
      [ROLES.AGENT]: '/agent-login.html',
      [ROLES.ADMIN]: '/admin-login.html'
    };

    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `${loginPages[role]}?return=${returnUrl}`;
  }

  /**
   * SAVE SESSION
   */
  saveSession(session) {
    const sessionData = JSON.stringify(session);
    localStorage.setItem(this.sessionKey, sessionData);
    sessionStorage.setItem(this.sessionKey, sessionData);
  }

  /**
   * LOAD SESSION
   */
  loadSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey) || 
                         sessionStorage.getItem(this.sessionKey);
      
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Check if session is expired (24 hours)
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
      
      if (hoursSinceLogin > 24) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }

  /**
   * GET AUTH HEADERS
   * For API requests
   */
  getAuthHeaders() {
    if (!this.currentUser) return {};
    
    return {
      'Authorization': `Bearer ${this.currentUser.token}`,
      'Content-Type': 'application/json'
    };
  }
}

// ============================================================================
// API REQUEST WRAPPER (WITH AUTH)
// ============================================================================

class AuthenticatedAPI {
  constructor(authService) {
    this.auth = authService;
    this.baseUrl = '/api';
  }

  /**
   * MAKE AUTHENTICATED REQUEST
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.auth.getAuthHeaders(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        alert('Session expired. Please login again.');
        this.auth.logout();
        throw new Error('Unauthorized');
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        alert('Access denied. Insufficient permissions.');
        throw new Error('Forbidden');
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// ============================================================================
// PAGE PROTECTION UTILITIES
// ============================================================================

/**
 * Protect agent pages - require agent login
 */
function protectAgentPage() {
  const auth = new AuthService();
  if (!auth.requireAuth(ROLES.AGENT)) {
    return false;
  }
  return auth.getCurrentUser();
}

/**
 * Protect admin pages - require admin login
 */
function protectAdminPage() {
  const auth = new AuthService();
  if (!auth.requireAuth(ROLES.ADMIN)) {
    return false;
  }
  return auth.getCurrentUser();
}

/**
 * Display user info in header
 */
function displayUserInfo(user) {
  const headerHTML = `
    <div class="user-info" style="position: fixed; top: 10px; right: 20px; background: white; padding: 10px 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;">
      <span style="margin-right: 15px; font-weight: 600;">
        ${user.role === 'admin' ? '👑' : '🚚'} ${user.name}
      </span>
      <button onclick="auth.logout()" style="background: #dc3545; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">
        Logout
      </button>
    </div>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================================================
// EXPORT
// ============================================================================

// Create global instances
const auth = new AuthService();
const api = new AuthenticatedAPI(auth);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AuthService,
    AuthenticatedAPI,
    ROLES,
    PERMISSIONS,
    protectAgentPage,
    protectAdminPage,
    displayUserInfo,
    auth,
    api
  };
}
