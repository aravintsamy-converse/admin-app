const Layout = async ({ children }: { children: React.ReactNode }) => {

  return (
    
      <div className="bg-red-400 h-[400px] w-full flex flex-col items-center justify-center">
        {children}
      </div>
  );
};

export default Layout;