/**
 * Servizio API per React Native con refresh automatico
 */

import {auth} from "./auth";

class ApiService {
  private baseURL = "https://www.upcominghub.com";

  /**
   * Ottieni i dati della homepage
   */
  async getHomepageData() {
    try {
      const response = await auth.makeAuthenticatedRequest("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              homepage {
                featuredItems {
                  id
                  name
                }
              }
            }
          `,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }

      throw new Error("Failed to fetch homepage data");
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      throw error;
    }
  }

  /**
   * Ottieni i dati dell'utente
   */
  async getUserData() {
    try {
      const response = await auth.makeAuthenticatedRequest(
        "/api/auth/credentials/me"
      );

      if (response.ok) {
        const result = await response.json();
        return result.data?.user;
      }

      throw new Error("Failed to fetch user data");
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  /**
   * Aggiorna il profilo utente
   */
  async updateUserProfile(userData: any) {
    try {
      const response = await auth.makeAuthenticatedRequest(
        "/api/user/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }

      throw new Error("Failed to update profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Ottieni gli articoli
   */
  async getArticles(filter?: any) {
    try {
      const response = await auth.makeAuthenticatedRequest("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetArticles($filter: ArticlesFilterInput) {
              articles(filter: $filter) {
                data {
                  id
                  title
                  content
                  excerpt
                  slug
                  published
                  createdAt
                  updatedAt
                  author {
                    id
                    name
                    email
                    image
                    createdAt
                    updatedAt
                    role
                    slug
                    type
                  }
                  cover
                  collections {
                    id
                    name
                    slug
                    description
                  }
                }
                pagination {
                  page
                  limit
                  total
                  totalPages
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
          `,
          variables: {filter},
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }

      throw new Error("Failed to fetch articles");
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  }

  /**
   * Ottieni un articolo per slug
   */
  async getArticleBySlug(slug: string) {
    try {
      const response = await auth.makeAuthenticatedRequest("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetArticleBySlug($slug: String!) {
              article(slug: $slug) {
                id
                title
                content
                excerpt
                slug
                published
                createdAt
                updatedAt
                author {
                  id
                  name
                  email
                }
                cover
                collections {
                  id
                  name
                  slug
                  description
                }
              }
            }
          `,
          variables: {slug},
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }

      throw new Error("Failed to fetch article");
    } catch (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
