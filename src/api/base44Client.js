// Mock API client for base44

const genericFilter = (data, filters = {}) => {
  return data.filter(item => {
    return Object.keys(filters).every(key => {
      if (!filters[key]) return true;
      return item[key] === filters[key];
    });
  });
};

// Mock API client for base44
export const base44 = {
  auth: {
    me: async () => {
      // Mock user data
      return {
        id: "user123",
        email: "user@example.com",
        full_name: "John Doe",
        profile_image: null,
        phone: "+213123456789",
        address: "123 Main St",
        city: "Algiers",
        birth_date: "1990-01-01"
      };
    },
    updateMe: async (data) => {
      // Mock update
      return { ...data };
    }
  },
  entities: {
    Gym: {
      list: async (options = {}) => {
        // Mock gyms data
        return [
          {
            id: "gym1",
            name: "FitLife Gym",
            owner_email: "owner@gym.com",
            description: "Modern gym with all facilities",
            address: "123 Fitness St",
            city: "Algiers",
            area: "16",
            phone: "+213123456789",
            amenities: ["Free Weights", "Machines", "Cardio"],
            hours: "Mon-Fri: 6am-10pm",
            image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
            status: "active",
            capacity: 100,
            featured: true
          },
          {
            id: "gym2",
            name: "PowerHouse",
            owner_email: "owner2@gym.com",
            description: "Strength training focused",
            address: "456 Power Ave",
            city: "Oran",
            area: "31",
            phone: "+213987654321",
            amenities: ["Free Weights", "Machines"],
            hours: "Mon-Sat: 7am-9pm",
            image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
            status: "active",
            capacity: 50,
            featured: true
          },
          {
            id: "gym3",
            name: "Elite Fitness",
            owner_email: "owner3@gym.com",
            description: "Premium fitness center",
            address: "789 Elite Blvd",
            city: "Constantine",
            area: "25",
            phone: "+213555666777",
            amenities: ["Free Weights", "Machines", "Cardio", "Swimming Pool"],
            hours: "Mon-Sun: 6am-11pm",
            image_url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800",
            status: "active",
            capacity: 200,
            featured: true
          }
        ];
      },
      filter: async (filters = {}, sort = '', limit = 100) => {
        console.log('Gym.filter called with filters:', filters);
        const allGyms = await base44.entities.Gym.list();
        console.log('All gyms:', allGyms);
        const filtered = allGyms.filter(gym => {
          const result = Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            const match = gym[key] === filters[key];
            console.log(`Gym ${gym.id}, key ${key}, gym[${key}]=${gym[key]}, filters[${key}]=${filters[key]}, match=${match}`);
            return match;
          });
          console.log(`Gym ${gym.id} included: ${result}`);
          return result;
        });
        console.log('Filtered gyms:', filtered);
        return filtered;
      },
      create: async (data) => {
        // Mock create
        return { id: "new_gym_" + Date.now(), ...data };
      }
    },
    Membership: {
      filter: async (filters = {}, sort = '', limit = 100) => {
        // Mock memberships
        const data = [
          {
            id: "mem1",
            user_email: "user@example.com",
            plan_type: "classic",
            status: "active",
            total_visits: 10,
            remaining_visits: 8,
            price: 3000,
            purchase_date: "2024-01-01",
            expiry_date: "2024-04-01"
          }
        ];
        return genericFilter(data, filters);
      },
      create: async (data) => {
        return { id: "new_mem_" + Date.now(), ...data };
      },
      update: async (id, data) => {
        return { id, ...data };
      }
    },
    Payment: {
      filter: async (filters = {}) => {
        // Mock payments
        return [
          {
            id: "pay1",
            user_email: "user@example.com",
            amount: 3000,
            payment_method: "credit_card",
            status: "completed",
            payment_date: new Date().toISOString()
          }
        ].filter(p => {
          return Object.keys(filters).every(key => p[key] === filters[key]);
        });
      },
      create: async (data) => {
        return { id: "new_pay_" + Date.now(), ...data };
      }
    },
    CheckIn: {
      filter: async (filters = {}, sort = '', limit = 100) => {
        // Mock check-ins
        return [
          {
            id: "check1",
            user_email: "user@example.com",
            user_name: "John Doe",
            gym_id: "gym1",
            gym_name: "FitLife Gym",
            check_in_time: new Date().toISOString(),
            membership_status: "active"
          }
        ].filter(c => {
          return Object.keys(filters).every(key => c[key] === filters[key]);
        });
      },
      create: async (data) => {
        return { id: "new_check_" + Date.now(), ...data };
      }
    },
    GymFeedback: {
      filter: async (filters = {}, sort = '', limit = 100) => {
        // Mock feedbacks
        return [
          {
            id: "fb1",
            gym_id: "gym1",
            user_email: "user@example.com",
            user_name: "John Doe",
            rating: 5,
            comment: "Great gym!",
            created_date: new Date().toISOString()
          }
        ].filter(f => {
          return Object.keys(filters).every(key => f[key] === filters[key]);
        });
      },
      create: async (data) => {
        return { id: "new_fb_" + Date.now(), ...data };
      }
    },
    ChatSession: {
      filter: async (filters = {}, sort = '', limit = 100) => {
        // Mock sessions
        return [];
      },
      create: async (data) => {
        return { id: "new_session_" + Date.now(), ...data };
      },
      update: async (id, data) => {
        return { id, ...data };
      }
    },
    ChatMessage: {
      filter: async (filters = {}, sort = '', limit = 100) => {
        // Mock messages
        return [];
      },
      create: async (data) => {
        return { id: "new_msg_" + Date.now(), ...data };
      }
    },
    SingleVisitPayment: {
      create: async (data) => {
        return { id: "new_svp_" + Date.now(), ...data };
      }
    },
    User: {
      list: async () => {
        return [await base44.auth.me()];
      }
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        // Mock upload
        return { file_url: "https://example.com/uploaded.jpg" };
      },
      InvokeLLM: async ({ prompt }) => {
        // Mock AI response
        return "Thank you for your question. This is a mock AI response.";
      }
    }
  }
};