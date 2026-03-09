import java.io.File;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;

public class RecipeSearchApp {

    public static class Recipe {
        public String id;
        public String title;
        public List<String> ingredients;
        public String instructions;
        public String cookTime;
        public int servings;
        public List<String> tags;
    }

    private List<Recipe> recipes;

    public void buildIndex(String jsonFile) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        recipes = List.of(mapper.readValue(new File(jsonFile), Recipe[].class));
        System.out.println("Index built successfully with " + recipes.size() + " recipes.");
    }

    // search

    public List<Recipe> search(String query) {

        String[] terms = query.toLowerCase().split("\\s+");

        return recipes.stream()
                .filter(r -> {

                    for (String term : terms) {

                        boolean match =
                                fuzzyMatch(r.title, term)
                                || fuzzyListMatch(r.ingredients, term)
                                || fuzzyListMatch(r.tags, term)
                                || fuzzyMatch(r.instructions, term);

                        if (match) return true;
                    }

                    return false;
                })
                .collect(Collectors.toList());
    }

    // fridge search

    public List<Recipe> fridgeSearch(String ingredientsInput) {

        String[] fridge = ingredientsInput.toLowerCase().split("\\s+");

        return recipes.stream()
                .sorted((a, b) -> {

                    int matchA = countIngredientMatches(a, fridge);
                    int matchB = countIngredientMatches(b, fridge);

                    return Integer.compare(matchB, matchA);
                })
                .collect(Collectors.toList());
    }

    private int countIngredientMatches(Recipe r, String[] fridge) {

        int matches = 0;

        for (String f : fridge) {
            boolean found = r.ingredients.stream()
                    .anyMatch(i -> fuzzyMatch(i, f));

            if (found) matches++;
        }

        return matches;
    }

public List<String> getAllIngredients() {
    return recipes.stream()
        .flatMap(r -> r.ingredients.stream())
        .map(i -> i.toLowerCase())
        .distinct()
        .sorted()
        .toList();
}

public List<String> missingIngredients(Recipe r, String[] fridge) {
    return r.ingredients.stream()
        .filter(i -> 
            java.util.Arrays.stream(fridge)
                .noneMatch(f -> fuzzyMatch(i, f))
        )
        .toList();
}


public List<Recipe> getRecipes() {
    return recipes;
}

    // fuzzy helpers 4 typos

    private boolean fuzzyListMatch(List<String> list, String term) {
        return list.stream().anyMatch(i -> fuzzyMatch(i, term));
    }

    private boolean fuzzyMatch(String text, String query) {

        text = text.toLowerCase();
        query = query.toLowerCase();

        if (text.contains(query)) return true;

        int distance = levenshteinDistance(text, query);

        return distance <= 2;
    }

    private int levenshteinDistance(String a, String b) {

        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {

                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;

                dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                        dp[i - 1][j - 1] + cost
                );
            }
        }

        return dp[a.length()][b.length()];
    }
}