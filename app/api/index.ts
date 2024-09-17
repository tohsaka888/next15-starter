"use server";

export const getPromiseResult = async () => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: "Promise resolved after 1.5 seconds",
        });
      }, 6000);
    });
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};
