# hdja-recipes

THINGS THE PROJECT MUST CONTAIN:
- [] react
- [] search
- [] self-serving

TODO:
- [x] make basic page (no styles)
- [x] json file for storage
- [x] implement search
- [x] test locally
- [x] after local sucess -> improve design
- [] transcribe ur recipies
- [] modify layout (rwd)
- [] favicon
- [] dark mode
- [] remove find recipe button - functionslity --> select button --> filter top matches + add reset button that removes all filters + add addmore button to make space
- [] use tags as category filters
- [] move random recipe button somewhere else
- [] upon hover/click on hdja tats - popup that says 'wip' or sumn
- [] once complete move to raspberry

To run locally:
1. search server: 
mvn exec:java -Dexec.mainClass="RecipeSearchServer"
2. front end: npm run dev