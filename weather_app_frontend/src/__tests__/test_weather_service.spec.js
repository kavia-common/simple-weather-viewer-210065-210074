 /**
  * Traceability: REQ-FE-SRV-001; VP-FE-SRV-001
  * GxP Impact: NO (Service fetch + mock data; tests ensure error messaging)
  */
describe("WeatherService", () => {
  const REAL_MODULE_PATH = "../services/WeatherService";

  beforeEach(() => {
    jest.resetModules();
    // Default: no API key => mock mode
    delete process.env.REACT_APP_OPENWEATHER_API_KEY;
  });

  test("isMockMode() returns true when no API key", async () => {
    const { isMockMode } = await import(REAL_MODULE_PATH);
    expect(isMockMode()).toBe(true);
  });

  test("getCurrentWeatherByCity returns deterministic mock data", async () => {
    const { getCurrentWeatherByCity, isMockMode } = await import(REAL_MODULE_PATH);
    expect(isMockMode()).toBe(true);
    const data = await getCurrentWeatherByCity("Paris");
    expect(data.city).toBe("Paris");
    expect(typeof data.tempC).toBe("number");
    expect(data.mock).toBe(true);
    expect(data.iconUrl).toMatch(/^https:\/\/openweathermap\.org\/img\/wn\/\w+@2x\.png$/);
  });

  test("real mode success normalizes API response", async () => {
    process.env.REACT_APP_OPENWEATHER_API_KEY = "test-key";
    jest.resetModules();
    const { getCurrentWeatherByCity, isMockMode } = await import(REAL_MODULE_PATH);
    expect(isMockMode()).toBe(false);

    // Mock fetch success
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            name: "London",
            sys: { country: "GB" },
            main: { temp: 13.4, humidity: 81 },
            weather: [{ main: "Clouds", icon: "02d" }],
            wind: { speed: 5 }, // m/s
          }),
      })
    );

    const data = await getCurrentWeatherByCity("London");
    expect(data.mock).toBe(false);
    expect(data.city).toBe("London");
    expect(data.country).toBe("GB");
    expect(data.tempC).toBe(Math.round(13.4));
    expect(data.condition).toBe("Clouds");
    expect(data.windKph).toBe(Math.round(5 * 3.6));
  });

  test("real mode 404 returns user-friendly 'City not found' error", async () => {
    process.env.REACT_APP_OPENWEATHER_API_KEY = "test-key";
    jest.resetModules();
    const { getCurrentWeatherByCity } = await import(REAL_MODULE_PATH);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      })
    );

    await expect(getCurrentWeatherByCity("UnknownCity")).rejects.toThrow(/City not found/i);
  });

  test("real mode network error is handled", async () => {
    process.env.REACT_APP_OPENWEATHER_API_KEY = "test-key";
    jest.resetModules();
    const { getCurrentWeatherByCity } = await import(REAL_MODULE_PATH);

    global.fetch = jest.fn(() => Promise.reject(new Error("Network down")));

    await expect(getCurrentWeatherByCity("Paris")).rejects.toThrow(/Network error/i);
  });
});
