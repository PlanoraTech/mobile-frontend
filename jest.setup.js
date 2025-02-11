jest.mock("expo-font", () => {
    const module = {
        ...jest.requireActual("expo-font"),
        isLoaded: jest.fn(() => true),
    };


    return module;
});