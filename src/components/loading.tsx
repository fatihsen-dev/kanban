export default function Loading() {
   return (
      <div className='h-screen fixed inset-0 w-full bg-background z-50'>
         <div className='flex items-center justify-center h-full'>
            <div className='w-12 aspect-square border-4 border-foreground border-t-transparent rounded-full animate-spin'></div>
         </div>
      </div>
   );
}
