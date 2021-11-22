export class SeedManager {
    private static seed = 1;

    public static getSeed() {
        return SeedManager.seed++;
    }
}
