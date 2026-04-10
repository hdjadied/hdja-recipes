import java.io.File;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.sql.*;

public class RecipeSearchApp {

    public static class Ingredient {
        public String name;
        public Double quantity;
        public String unit;
    }

    public static class Recipe {
        public String id;
        public String title;
        public List<Ingredient> ingredients;
        public String instructions;
        public String cookTime;
        public int servings;
        public List<String> tags;
        public List<String> images;
    }

    private List<Recipe> recipes;

    public void buildIndex(String jsonFile) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Recipe[] recipesArray = mapper.readValue(new File(jsonFile), Recipe[].class);
        recipes = Arrays.asList(recipesArray);

        // Build index if needed, but for now, just load
        System.out.println("Loaded " + recipes.size() + " recipes from JSON.");
    }

    private List<String> parseImages(String imageStr, ObjectMapper mapper) throws Exception {
        if (imageStr == null || imageStr.isEmpty()) {
            return new ArrayList<>();
        }
        if (imageStr.startsWith("[")) {
            return mapper.readValue(imageStr, new TypeReference<List<String>>(){});
        } else {
            return List.of(imageStr);
        }
    }

    private List<Ingredient> loadIngredients(Connection conn, String recipeId) throws SQLException {
        String sql = "SELECT i.name, ri.quantity, ri.unit FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id WHERE ri.recipe_id = ?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, recipeId);
        ResultSet rs = stmt.executeQuery();

        List<Ingredient> ings = new ArrayList<>();
        while (rs.next()) {
            Ingredient ing = new Ingredient();
            ing.name = rs.getString("name");
            String qty = rs.getString("quantity");
            if (qty != null) {
                try {
                    ing.quantity = Double.parseDouble(qty);
                } catch (NumberFormatException e) {
                    ing.quantity = null;
                }
            }
            ing.unit = rs.getString("unit");
            ings.add(ing);
        }
        return ings;
    }

    private List<String> loadTags(Connection conn, String recipeId) throws SQLException {
        String sql = "SELECT t.name FROM recipe_tags rt JOIN tags t ON rt.tag_id = t.id WHERE rt.recipe_id = ?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, recipeId);
        ResultSet rs = stmt.executeQuery();

        List<String> tags = new ArrayList<>();
        while (rs.next()) {
            tags.add(rs.getString("name"));
        }
        return tags;
    }

    // search

    public List<Recipe> search(String query) {

        String[] terms = query.toLowerCase().split("\\s+");

        return recipes.stream()
                .filter(r -> {

                    for (String term : terms) {

                        boolean match =
                                fuzzyMatch(r.title, term)
                                || fuzzyIngredientMatch(r.ingredients, term)
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
                    .anyMatch(i -> fuzzyMatch(i.name, f));

            if (found) matches++;
        }

        return matches;
    }

    public List<String> getAllIngredients() {
        return recipes.stream()
                .flatMap(r -> r.ingredients.stream())
                .map(i -> i.name.toLowerCase())
                .distinct()
                .sorted()
                .toList();
    }

    public List<String> missingIngredients(Recipe r, String[] fridge) {
        return r.ingredients.stream()
                .map(i -> i.name)
                .filter(name ->
                        java.util.Arrays.stream(fridge)
                                .noneMatch(f -> fuzzyMatch(name, f))
                )
                .toList();
    }

    public List<Recipe> getRecipes() {
        return recipes;
    }

    // fuzzy helpers

    private boolean fuzzyIngredientMatch(List<Ingredient> list, String term) {
        return list.stream().anyMatch(i -> fuzzyMatch(i.name, term));
    }

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