type GridCols = 'auto' | 1 | 2 | 3

export const defaultLayout = {
  sideNav: {
    isNavOpen: false,
    tooltip: true,
    secondaryNav: false,
    navPosition: 'left',
    width: [60, 225] as [number, number],
    iconSize: [24, 24] as [number, number],
    textSize: '14px',
    textWeight: 'normal',
    textColor: '#4A5A76',
    textPosition: 'left',
    badgeColor: 'green',
    badgeSize: 12,
    borderRadius: '8px',
    gap: '10px',
    exact: true,
    expandOnHover: false,
    showOnCollapse: true,
    header: {
      image: '/cdspng.png',
      width: [33, 122],
      icons: ['NavItem'],
    },
    navMain: [
      {
        title: 'Search',
        icon: 'Search',
      },
      {
        title: 'Work Space',
        icon: 'LayoutGridIcon',
        isActive: true,
        items: [
          {
            title: 'My Work Space',
            url: '/job-description',
          },
          {
            title: 'My Teams',
            isActive: false,
            items: [
              {
                title: 'HR Team',
                items: [
                  {
                    title: 'Team Lead',
                    url: '/job-description',
                  },
                  {
                    title: 'Recruiter',
                    url: '#',
                  },
                ],
              },
              {
                title: 'Dev Team',
                url: '#',
              },
            ],
          },
          {
            title: 'Workspace Settings',
            url: '#',
          },
        ],
      },

      {
        title: 'Favorite',
        url: '#',
        icon: 'Heart',
      },
      {
        title: 'Projects',
        icon: 'Project',
        items: [
          {
            title: 'All Projects',
            url: '/job-description',
          },
          {
            title: 'Create  Projects',
            url: '#',
          },
        ],
      },
      {
        title: 'Teams',
        url: '#',
        icon: 'Teams',
      },
    ],
  },

  form: {
    gridCols: 'auto' as GridCols,
    labelAlignment: {
      current: 'top',
      options: ['top', 'left'],
    },
    fields: [
      {
        id: 'full_name',
        label: 'Full Name',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Enter full name',
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        value: '',
        required: true,
        placeholder: 'Enter email',
      },
      {
        id: 'phone',
        label: 'Phone',
        type: 'number',
        value: '',
        required: true,
        placeholder: 'Enter phone number',
      },
      {
        id: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        value: '',
        required: true,
        placeholder: 'Enter date of birth',
      },
      {
        id: 'active_status',
        label: 'Active Status',
        type: 'switch',
        Value: false,
        required: false,
        placeholder: 'Select active status',
      },
      {
        id: 'dropdown',
        label: 'Dropdown',
        type: 'dropdown',
        value: '',
        required: true,
        placeholder: 'Select an option',
        options: [
          { id: 1, name: 'Option 1' },
          { id: 2, name: 'Option 2' },
          { id: 3, name: 'Option 3' },
          { id: 4, name: 'Option 4' },
        ],
      },
      {
        id: 'create_dropdown',
        label: 'Create Dropdown',
        type: 'create_dropdown',
        value: '',
        options: [
          { id: 1, name: 'option 1' },
          { id: 2, name: 'option 2' },
          { id: 3, name: 'option 3' },
        ],
        required: true,
        placeholder: 'Create a new option',
      },
      {
        id: 'search_dropdown',
        label: 'Search Dropdown',
        type: 'search_dropdown',
        value: '',
        required: true,
        placeholder: 'Select or search',
      },
      {
        id: 'secondary_nav_toggle',
        label: 'Enable Secondary Navigation',
        type: 'switch',
        value: false,
        required: false,
        placeholder: 'Toggle secondary navigation',
      },
    ],
    gridbuttons: [
      { id: 'btn1', value: 1 },
      { id: 'btn2', value: 2 },
      { id: 'btn3', value: 3 },
    ],
  },
  chat: {
    expanded: false,
    width: 341,
    maxwidth: 1300,
    draggable: false,
    position: [0, 0] as [number, number],
  },
}
