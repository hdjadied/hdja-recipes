import static spark.Spark.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Random; 


public class RecipeSearchServer {

    public static void main(String[] args) throws Exception {

        RecipeSearchApp searchApp = new RecipeSearchApp();
        searchApp.buildIndex("recipes.json");

        ObjectMapper mapper = new ObjectMapper();

        port(4567);

        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        });

        options("/*", (req, res) -> {
            res.status(200);
            return "";
        });

        // search

        get("/search", (req, res) -> {

            String query = req.queryParams("q");

            if (query == null || query.isEmpty()) {
                res.status(400);
                return "Missing query parameter 'q'";
            }

            List<RecipeSearchApp.Recipe> results = searchApp.search(query);

            res.type("application/json");

            return mapper.writeValueAsString(results);
        });

        // ingredient list

        get("/ingredients", (req, res) -> {

            List<String> ingredients = searchApp.getAllIngredients();

            res.type("application/json");

            return mapper.writeValueAsString(ingredients);
        });

        // fridge search

        get("/fridge", (req, res) -> {

            String ingredients = req.queryParams("i");

            if (ingredients == null || ingredients.isEmpty()) {
                res.status(400);
                return "Missing query parameter 'i'";
            }

            List<RecipeSearchApp.Recipe> results = searchApp.fridgeSearch(ingredients);

            res.type("application/json");

            return mapper.writeValueAsString(results);
        });

        // rando recipe

        get("/random", (req, res) -> {
            java.util.Random rand = new java.util.Random();
            RecipeSearchApp.Recipe r =
                searchApp.getRecipes().get(rand.nextInt(searchApp.getRecipes().size()));

            res.type("application/json");
            return mapper.writeValueAsString(r);
        });

        System.out.println("Server running:");
        System.out.println("Search:  http://localhost:4567/search?q=pasta");
        System.out.println("Fridge:  http://localhost:4567/fridge?i=chicken garlic rice");
        System.out.println("Random:  http://localhost:4567/random");
    }
}