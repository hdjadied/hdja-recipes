import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.*;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.*;
import org.apache.lucene.store.*;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;

public class RecipeSearchApp {

    public static class RecipeList {
        public List<Recipe> recipes;
    }

    public static class Recipe {
        public String id;
        public String title;
        public String description;
        public List<String> ingredients;
        public List<String> instructions;
        public List<String> tags;
        public Number prepTimeMinutes;
        public Number servings;
    }

    // ----- Main -----

    public static void main(String[] args) throws Exception {

        String indexPath = "index";
        String jsonPath = "recipes.json";

        indexRecipes(jsonPath, indexPath);

        if (args.length == 0) {
            System.out.println("Usage: java RecipeSearchApp <search-term>");
            return;
        }

        searchRecipes(args[0], indexPath);
    }

    // ----- Index Recipes -----

    public static void indexRecipes(String jsonFile, String indexDir) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        RecipeList recipeList = mapper.readValue(new File(jsonFile), RecipeList.class);

        Directory dir = FSDirectory.open(Paths.get(indexDir));
        StandardAnalyzer analyzer = new StandardAnalyzer();

        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        IndexWriter writer = new IndexWriter(dir, config);

        writer.deleteAll();

        for (Recipe recipe : recipeList.recipes) {

            Document doc = new Document();

            doc.add(new StringField("id", recipe.id, Field.Store.YES));
            doc.add(new TextField("title", recipe.title, Field.Store.YES));
            doc.add(new TextField("description", recipe.description, Field.Store.YES));

            doc.add(new TextField(
                    "ingredients",
                    String.join(" ", recipe.ingredients),
                    Field.Store.YES));

            doc.add(new TextField(
                    "instructions",
                    String.join(" ", recipe.instructions),
                    Field.Store.NO));

            doc.add(new TextField(
                    "tags",
                    String.join(" ", recipe.tags),
                    Field.Store.YES));

            writer.addDocument(doc);
        }

        writer.close();
        System.out.println("Index built successfully.");
    }

    // ----- Search Recipes -----

    public static void searchRecipes(String queryStr, String indexDir) throws Exception {

        Directory dir = FSDirectory.open(Paths.get(indexDir));
        DirectoryReader reader = DirectoryReader.open(dir);
        IndexSearcher searcher = new IndexSearcher(reader);

        StandardAnalyzer analyzer = new StandardAnalyzer();

        QueryParser parser = new QueryParser("ingredients", analyzer);
        Query query = parser.parse(queryStr);

        TopDocs results = searcher.search(query, 10);

        System.out.println("\nSearch results for: " + queryStr);

        for (ScoreDoc scoreDoc : results.scoreDocs) {
            Document doc = searcher.doc(scoreDoc.doc);

            System.out.println("------------------------");
            System.out.println("Title: " + doc.get("title"));
            System.out.println("Ingredients: " + doc.get("ingredients"));
        }

        reader.close();
    }
}