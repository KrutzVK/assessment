var faker = require('chance');

function generateToDos() {
    var todos = []

    for (var id = 0; id < 50; id++) {
        var text = faker.sentence({ words: 5 });
        var priority = faker.integer({ min: 1, max: 5 });
        var done = faker.bool();

        todos.push({
            "id": id,
            "text": text,
            "priority": priority,
            "done": done
        })
    }

    return { 'todos': todos }
}

module.exports = generateToDos;