import static spark.Spark.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

public class RecipeSearchServer {

    public static void main(String[] args) throws Exception {
        // Reuse your RecipeSearchApp
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
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
            res.status(200);
            return "";
        });

        get("/search", (req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET");
            res.header("Access-Control-Allow-Headers", "Content-Type");

            String query = req.queryParams("q");
            if (query == null || query.isEmpty()) {
                res.status(400);
                return "Missing query parameter 'q'";
            }

            List<RecipeSearchApp.Recipe> results = searchApp.search(query);
            res.type("application/json");
            return mapper.writeValueAsString(results);
        });

        System.out.println("Recipe search server running at http://localhost:4567/search?q=<keyword>");
    }
}