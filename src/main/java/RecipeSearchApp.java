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

    public List<Recipe> search(String keyword) {
        String lower = keyword.toLowerCase();
        return recipes.stream()
                .filter(r -> r.title.toLowerCase().contains(lower)
                        || r.ingredients.stream().anyMatch(i -> i.toLowerCase().contains(lower))
                        || r.tags.stream().anyMatch(t -> t.toLowerCase().contains(lower))
                        || r.instructions.toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    // Optional CLI test
    public static void main(String[] args) throws Exception {
        if (args.length == 0) args = new String[]{"pasta"};
        RecipeSearchApp app = new RecipeSearchApp();
        app.buildIndex("recipes.json");
        List<Recipe> results = app.search(args[0]);
        System.out.println("Search results for: " + args[0]);
        for (Recipe r : results) {
            System.out.println(r.id + ": " + r.title + " (" + r.cookTime + ", serves " + r.servings + ")");
        }
    }
}