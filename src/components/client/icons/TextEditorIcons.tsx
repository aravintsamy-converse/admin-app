export const BoldIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="bold-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="16"
    className="responsive-svg"
    viewBox="0 0 10 16"
    fill="none"
  >
    <path
      d="M5.78125 11.25H0V0H5.3125C5.93885 3.72804e-05 6.5521 0.179345 7.07982 0.516741C7.60753 0.854137 8.02764 1.33552 8.29054 1.90403C8.55343 2.47254 8.64812 3.10442 8.56341 3.72501C8.4787 4.34561 8.21814 4.92899 7.8125 5.40625C8.34233 5.82997 8.72779 6.40751 8.91582 7.05935C9.10386 7.7112 9.08522 8.4053 8.86248 9.04612C8.63974 9.68693 8.22384 10.2429 7.67204 10.6376C7.12024 11.0323 6.45966 11.2463 5.78125 11.25ZM1.875 9.375H5.76875C5.95342 9.375 6.13628 9.33863 6.3069 9.26796C6.47751 9.19729 6.63254 9.0937 6.76312 8.96312C6.8937 8.83254 6.99728 8.67751 7.06796 8.5069C7.13863 8.33628 7.175 8.15342 7.175 7.96875C7.175 7.78408 7.13863 7.60122 7.06796 7.4306C6.99728 7.25999 6.8937 7.10496 6.76312 6.97438C6.63254 6.8438 6.47751 6.74021 6.3069 6.66954C6.13628 6.59887 5.95342 6.5625 5.76875 6.5625H1.875V9.375ZM1.875 4.6875H5.3125C5.49717 4.6875 5.68003 4.65113 5.85065 4.58046C6.02126 4.50978 6.17629 4.4062 6.30687 4.27562C6.43745 4.14504 6.54104 3.99001 6.61171 3.8194C6.68238 3.64878 6.71875 3.46592 6.71875 3.28125C6.71875 3.09658 6.68238 2.91372 6.61171 2.7431C6.54104 2.57249 6.43745 2.41746 6.30687 2.28688C6.17629 2.1563 6.02126 2.05272 5.85065 1.98204C5.68003 1.91137 5.49717 1.875 5.3125 1.875H1.875V4.6875Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const ItalicIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="italic-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="16"
    viewBox="0 0 12 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M11.25 1.25V0H3.125V1.25H6.3375L3.60625 10H0V11.25H8.125V10H4.9125L7.64375 1.25H11.25Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const UnderlineIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="underline-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="16"
    viewBox="0 0 15 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M0 13.125H15V14.375H0V13.125ZM7.5 11.25C6.33968 11.25 5.22688 10.7891 4.40641 9.96859C3.58594 9.14812 3.125 8.03532 3.125 6.875V0H4.375V6.875C4.375 7.7038 4.70424 8.49866 5.29029 9.08471C5.87634 9.67076 6.6712 10 7.5 10C8.3288 10 9.12366 9.67076 9.70971 9.08471C10.2958 8.49866 10.625 7.7038 10.625 6.875V0H11.875V6.875C11.875 8.03532 11.4141 9.14812 10.5936 9.96859C9.77312 10.7891 8.66032 11.25 7.5 11.25Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const AlignLeftIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="alignleft-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="16"
    viewBox="0 0 14 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M13.5 13.5V13.3333H0.5V13.5H13.5ZM8.65833 10.2917V10.125H0.5V10.2917H8.65833ZM13.5 7.08333V6.91667H0.5V7.08333H13.5ZM8.65833 3.875V3.70833H0.5V3.875H8.65833ZM13.5 0.666667V0.5H0.5V0.666667H13.5Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
      stroke={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const AlignCenterIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="aligncenter-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="16"
    viewBox="0 0 14 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M0.5 13.5V13.3333H13.5V13.5H0.5ZM3.68889 10.2917V10.125H10.3306V10.2917H3.68889ZM0.5 7.08333V6.91667H13.5V7.08333H0.5ZM3.68889 3.875V3.70833H10.3306V3.875H3.68889ZM0.5 0.666667V0.5H13.5V0.666667H0.5Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
      stroke={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const AlignRightIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="alignright-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="16"
    viewBox="0 0 14 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M0.5 13.5V13.3333H13.5V13.5H0.5ZM5.34167 10.2917V10.125H13.5V10.2917H5.34167ZM0.5 7.08333V6.91667H13.5V7.08333H0.5ZM5.34167 3.875V3.70833H13.5V3.875H5.34167ZM0.5 0.666667V0.5H13.5V0.666667H0.5Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
      stroke={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const JustifyIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="justify-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="16"
    viewBox="0 0 14 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M0.5 13.5V13.3333H13.5V13.5H0.5ZM0.5 10.2917V10.125H13.5V10.2917H0.5ZM0.5 7.08333V6.91667H13.5V7.08333H0.5ZM0.5 3.875V3.70833H13.5V3.875H0.5ZM0.5 0.666667V0.5H13.5V0.666667H0.5Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
      stroke={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const BulletListIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="bulletList-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="16"
    viewBox="0 0 14 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M0.991667 14C0.719445 14 0.486111 13.8872 0.291667 13.6617C0.0972222 13.4361 0 13.1678 0 12.8567C0 12.53 0.0972222 12.25 0.291667 12.0167C0.486111 11.7833 0.719445 11.6667 0.991667 11.6667C1.25093 11.6667 1.47454 11.7833 1.6625 12.0167C1.85046 12.25 1.94444 12.53 1.94444 12.8567C1.94444 13.1678 1.85046 13.4361 1.6625 13.6617C1.47454 13.8872 1.25093 14 0.991667 14ZM3.88889 13.5333V12.1333H14V13.5333H3.88889ZM0.991667 8.16667C0.719445 8.16667 0.486111 8.05389 0.291667 7.82833C0.0972222 7.60278 0 7.32667 0 7C0 6.67333 0.0972222 6.39722 0.291667 6.17167C0.486111 5.94611 0.719445 5.83333 0.991667 5.83333C1.25093 5.83333 1.47454 5.95 1.6625 6.18333C1.85046 6.41667 1.94444 6.68889 1.94444 7C1.94444 7.31111 1.85046 7.58333 1.6625 7.81667C1.47454 8.05 1.25093 8.16667 0.991667 8.16667ZM3.88889 7.7V6.3H14V7.7H3.88889ZM0.972222 2.33333C0.7 2.33333 0.469907 2.22056 0.281944 1.995C0.0939815 1.76944 0 1.49333 0 1.16667C0 0.84 0.0939815 0.563889 0.281944 0.338334C0.469907 0.112778 0.7 0 0.972222 0C1.24444 0 1.47454 0.112778 1.6625 0.338334C1.85046 0.563889 1.94444 0.84 1.94444 1.16667C1.94444 1.49333 1.85046 1.76944 1.6625 1.995C1.47454 2.22056 1.24444 2.33333 0.972222 2.33333ZM3.88889 1.86667V0.466667H14V1.86667H3.88889Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const NumberListIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="numberlist-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="16"
    viewBox="0 0 14 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M0 14V13.2562H1.63333V12.6875H0.816667V11.9437H1.63333V11.375H0V10.6312H2.29444V14H0ZM4.06389 12.9281V11.6156H14V12.9281H4.06389ZM0 8.68437V7.98438L1.45833 6.05938H0V5.31562H2.29444V6.01562L0.816667 7.94062H2.29444V8.68437H0ZM4.06389 7.6125V6.3H14V7.6125H4.06389ZM0.816667 3.4125V0.74375H0V0H1.47778V3.4125H0.816667ZM4.06389 2.29688V0.984375H14V2.29688H4.06389Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)

export const FontStyleIcon = ({ active }: { active?: boolean }) => (
  <svg
    data-testid="fontstyle-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="16"
    viewBox="0 0 12 16"
    className="responsive-svg"
    fill="none"
  >
    <path
      d="M8.41667 7.07833C8.41667 7.07833 5.41667 10.3283 5.41667 12.3283C5.4112 12.7278 5.48445 13.1244 5.63225 13.4955C5.78006 13.8666 5.99951 14.205 6.27809 14.4913C6.8407 15.0696 7.60997 15.4006 8.41667 15.4117C9.22337 15.4227 10.0014 15.1129 10.5797 14.5502C10.866 14.2717 11.0946 13.9394 11.2525 13.5725C11.4104 13.2056 11.4945 12.8111 11.5 12.4117V12.3283C11.5 10.3283 8.41667 7.07833 8.41667 7.07833ZM7.19167 5.9475L7.74917 5.34417L5.83333 0H4.16667L0 11.6667H1.66667L2.85833 8.33333H5.31083C5.8764 7.49243 6.50398 6.69493 7.18833 5.9475H7.19167ZM5 2.33333L6.55 6.66667H3.45333L5 2.33333Z"
      fill={active ? 'hsl(var(--background))' : '#81868C'}
    />
  </svg>
)
