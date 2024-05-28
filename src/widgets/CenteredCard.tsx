interface CenteredCardProps {
  children: React.ReactNode,
}

function CenteredCard ({ children }: CenteredCardProps) : JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="min-w-fit min-h-fit text-center p-4 shadow-lg bg-white dark:bg-black">
      {children}
      </div>
    </div>
  );
}

export default CenteredCard;
