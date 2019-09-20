jest.mock('../lib/files.js', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  readdir: jest.fn(),
}));

// for setting up mock expectations
const { readFile, writeFile, readdir } = require('../lib/files');

const DocumentCollection = require('../lib/document-collection');
const path = require('path');

describe('Document Collection', () => {
  const folder = 'fake';

  it('saves a file to a given path', () => {
    //arrange
    const obj = { name: 'Luke', fake: true };

    const writeResponse = Promise.resolve(obj);
    writeFile.mockReturnValueOnce(writeResponse);

    const docCollect = new DocumentCollection(folder);

    //act
    return docCollect.save(obj)
      .then(() => {
        const writeCalls = writeFile.mock.calls;
        expect(writeCalls.length).toBe(1);
        expect(writeCalls[0][1]).toBe(JSON.stringify(obj));
        expect(obj.id).toEqual(expect.any(String));
      })
  })

  it('reads a file from a given path and returns and object', () => {
    const obj = { name: 'Luke', fake: true, id: 'lit' };

    readPromise = Promise.resolve(JSON.stringify(obj));
    readFile.mockReturnValueOnce(readPromise);

    const docCollection = new DocumentCollection(folder);

    const id = obj.id;

    return docCollection.get(id)
      .then(obj => {
        expect(readFile.mock.calls[0][0]).toBe(`${folder}/${id}.json`);
        expect(obj.id).toBe('lit');
      });
  });

  it('gets all files from a given folder', () => {
    const obj = { name: 'Luke', fake: true, id: 'lit' };

    readPromise = Promise.resolve(JSON.stringify(obj));
    readFile.mockReturnValueOnce(readPromise);

    readDirPromise = Promise.resolve(['lit.json']);
    readdir.mockReturnValueOnce(readDirPromise);

    const docCollection = new DocumentCollection(folder);

    return docCollection.getAll()
      .then(array => {
        expect(readdir.mock.calls[0][0]).toBe(folder);
        expect(readFile.mock.calls[0][0]).toBe(`${folder}/${obj.id}.json`);
        expect(array[0].id).toBe(obj.id);
      });
  });


});
