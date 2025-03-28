import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SAP_CONFIG } from './config';

/**
 * קליינט לחיבור ל-SAP API
 */
class SapClient {
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  /**
   * יוצר קליינט חדש לחיבור ל-SAP
   */
  constructor() {
    // יוצר תצורה בסיסית של הקליינט
    this.setupClient();
  }

  /**
   * הגדרת הקליינט של axios
   */
  private setupClient() {
    axios.defaults.baseURL = SAP_CONFIG.baseUrl;
    axios.defaults.timeout = SAP_CONFIG.timeout;

    // אינטרספטור לבקשות - מוסיף טוקן ואותנטיקציה
    axios.interceptors.request.use(async (config) => {
      // אם אין טוקן או שהטוקן פג תוקף, השג טוקן חדש
      if (!this.token || this.isTokenExpired()) {
        await this.authenticate();
      }

      // אם יש לנו טוקן, הוסף אותו לכותרת
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }

      return config;
    });
  }

  /**
   * בדיקה האם הטוקן פג תוקף
   */
  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    
    // אם נשארו פחות מ-5 דקות לפקיעת הטוקן, נחשיב אותו כפג תוקף
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;
    return this.tokenExpiry.getTime() - now.getTime() < fiveMinutes;
  }

  /**
   * קבלת טוקן אותנטיקציה מ-SAP
   */
  public async authenticate(): Promise<void> {
    try {
      // בתצורה אמיתית, יש להשתמש בפרמטרים מהקונפיגורציה וב-OAuth או בסיסי אותנטיקציה
      const response = await axios.post('/auth/token', {
        client_id: SAP_CONFIG.clientId,
        username: SAP_CONFIG.username,
        password: SAP_CONFIG.password,
        grant_type: 'password'
      });

      if (response.data && response.data.access_token) {
        this.token = response.data.access_token;
        
        // חישוב זמן פקיעת תוקף הטוקן
        const expiresIn = response.data.expires_in || 3600; // ברירת מחדל: שעה
        this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
        
        console.log('SAP authentication successful');
      } else {
        throw new Error('Authentication failed: Invalid response from SAP');
      }
    } catch (error) {
      console.error('SAP authentication error:', error);
      throw new Error('Failed to authenticate with SAP');
    }
  }

  /**
   * ביצוע בקשת GET ל-SAP
   */
  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const config: AxiosRequestConfig = {};
      if (params) {
        config.params = params;
      }

      const response: AxiosResponse<T> = await axios.get(`${SAP_CONFIG.gateway}${endpoint}`, config);
      return response.data;
    } catch (error) {
      console.error(`Error in SAP GET request to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * ביצוע בקשת POST ל-SAP
   */
  public async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(`${SAP_CONFIG.gateway}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error in SAP POST request to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * ביצוע בקשת PUT ל-SAP
   */
  public async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.put(`${SAP_CONFIG.gateway}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error in SAP PUT request to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * ביצוע בקשת DELETE ל-SAP
   */
  public async delete<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete(`${SAP_CONFIG.gateway}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error in SAP DELETE request to ${endpoint}:`, error);
      throw error;
    }
  }
}

// מייצא סינגלטון של הקליינט
export const sapClient = new SapClient();