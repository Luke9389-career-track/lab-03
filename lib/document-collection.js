const { readFile, writeFile, readdir } = require('./files');
const shortid = require('shortid');
const path = require('path');

class DocumentCollection {
  constructor(folder) {
    this.folder = folder;
  }

  save(object) {
    const shortId = shortid.generate();
    object.id = shortId;
    const serializedObject = JSON.stringify(object);
    return writeFile(`${this.folder}/${shortId}.json`, serializedObject, 'utf8')
      .then(() => {
        return object;
      })
      .catch(err => { console.log(err) });
  }

  get(id) {
    const path = `${this.folder}/${id}.json`;
    return readFile(path)
      .then(content => {
        return JSON.parse(content);
      })
  }

  getAll() {
    // TODO:
    return readdir(this.folder)
      .then((arr) => {
        return Promise.all(arr.map(element => {
          const shortId = path.parse(element).name;
          return this.get(shortId);
        }));
      })
      .catch(err => { console.log(err); });


    // 2. use Promise.all and map each file name to a this.get call (remove .json file extension!)
    // 3. "return" array of objects
  }
}

module.exports = DocumentCollection;