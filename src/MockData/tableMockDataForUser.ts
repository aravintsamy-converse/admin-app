export const metaData = {
  data: {
    views: {
      options: [
        {
          id: "view_101",
          label: "View Name 1",
          value: "view name 1",
          default: true,
        },
        {
          id: "view_102",
          label: "View Name 2",
          value: "view name 2",
          default: false,
        },
        {
          id: "view_103",
          label: "View Name 3",
          value: "view name 3",
          default: false,
        },
      ],
      current_view_details: [
        {
          field_name: "User",
          filter_type: "String",
          condition: "is",
          value: "John Doe",
        },
        {
          field_name: "Last Login",
          filter_type: "Date",
          condition: "is",
          value: "12/12/2020",
        },
      ],
      example_filters: [
        "Date Range: Last 30 days",
        "Revenue: > $10,000 AND < $50,000",
        "Status: Active AND (Region: NA OR EU)",
      ],
    },
    form_action_url: [
      {
        create: {
          form_id: "1",
          form_url: "/user/1",
          form_name: "user_create",
        },
      },
      {
        edit: {
          form_id: "2",
          form_url: "/user/2",
          form_name: "user_edit",
        },
      },
      {
        show: {
          form_id: "3",
          form_url: "/user/3",
          form_name: "user_show",
        },
      },
    ],
    table_actions_url: {
      edit: "/api/user/edit",
      show: "/api/user/show",
      delete: "/users-screen/delete-user",
      table_action: "/users-screen/users-pagination-sorting",
      view_filter: "/api/user/view",
      bulk_action: "/users-screen/bulk-actions",
      more_action: "/users-screen/more-actions",
    },
    favorite_screens: true,
    QuickFilters: [
      {
        id: "filter_7",
        filter_type: "Date",
        field_name: "latest_login_at",
        field_label: "Last Login",
        input_field: [
          {
            placeholder: "Select date",
            type: "calendar",
          },
        ],
      },
      {
        id: "filter_1",
        filter_type: "String",
        field_name: "user_name",
        field_label: "User Name",
        input_field: [
          {
            placeholder: "Search this list...",
            type: "text",
          },
        ],
      },
      {
        id: "filter_4",
        filter_type: "Dropdown",
        type: "single",
        field_name: "roleType",
        field_label: "Role Type",
        input_field: [
          {
            placeholder: "Role Type",
            label_icon: true,
            options: [
              {
                label: "System",
                value: "system",
                icon: "RiUserSettingsLine",
                color: "#606EB0",
              },
              {
                label: "Application",
                value: "application",
                icon: "GrDocumentUser",
                color: "#F0AD4E",
              },
            ],
          },
        ],
      },
      {
        id: "filter_5",
        filter_type: "Dropdown",
        type: "single",
        field_name: "lockStatus",
        field_label: "Lock Status",
        input_field: [
          {
            placeholder: "Lock Status",
            label_icon: true,
            options: [
              {
                label: "Locked",
                value: "true",
                icon: "FaLock",
                color: "#F04438",
              },
              {
                label: "Unlocked",
                value: "false",
                icon: "FaUnlock",
                color: "#28A745",
              },
            ],
          },
        ],
      },
    ],
    columnData: [
      {
        id: "U001",
        user_name: "riya",
        email: "riya@gmail.com",
        first_name: "riya",
        last_name: "raana",
        is_active: true,
        first_login: true,
        latest_login_at: "2024-03-21T00:00:00.000Z",
        account_locked: false,
        roles: {
          associated_id: "R001",
          associated_value: "Dashboard Admin",
        },
      },
      {
        id: "U001",
        user_name: "riya",
        email: "riya@gmail.com",
        first_name: "riya",
        last_name: "raana",
        is_active: true,
        first_login: true,
        latest_login_at: "2024-03-21T00:00:00.000Z",
        account_locked: false,
        roles: {
          associated_id: "R002",
          associated_value: "Payment Admin",
        },
      },
      {
        id: "edf4ca0a-dc5f-4d4e-b09b-f8d1653a2dd4",
        user_name: "sam",
        email: "sam@gmail.com",
        first_name: "sam",
        last_name: "mohan",
        is_active: false,
        first_login: true,
        latest_login_at: "2024-02-20T00:00:00.000Z",
        account_locked: true,
        account_locked_at: null,
        roles: {
          associated_id: "R001",
          associated_value: "Dashboard Admin",
        },
      },
    ],
    bulk_actions: [
      {
        label: "Change Lock status to Lock/Unlock",
        value: "lockstatus",
      },
      {
        label: "Change status to Active/Inactive",
        value: "status",
      },
    ],
    more_actions: [
      {
        label: "Duplicate",
        value: "dup_01",
      },
      {
        label: "Download",
        value: "down_01",
      },
      {
        label: "Share",
        value: "share_01",
      },
    ],
  },
};

export const globalPreferences = {
  data: {
    per_page_values: [
      {
        label: "10",
        value: 10,
      },
      {
        label: "20",
        value: 20,
      },
      {
        label: "50",
        value: 50,
      },
      {
        label: "100",
        value: 100,
      },
    ],
    preferences: {
      density: "comfortable",
      theme: "dark",
      per_page: 50,
      table_resizable: true,
      table_data_wrap: true,
    },
  },
};
