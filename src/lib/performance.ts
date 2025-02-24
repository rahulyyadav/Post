export const measurePerformance = (action: string) => {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      console.log(`${action} took ${duration}ms`);
    },
  };
};
