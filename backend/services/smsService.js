export const sendSMS = async ({ numbers, message }) => {
  console.log("🟡 DEMO SMS MODE ON");
  console.log("📞 To:", numbers);
  console.log("💬 Message:", message);

  // REAL SMS DISABLED – DEMO SUCCESS
  return {
    success: true,
    demo: true,
    smsSent: numbers.length
  };
};
