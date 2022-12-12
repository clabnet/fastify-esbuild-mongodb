// https://ship.paralect.com/docs/packages/node-mongo
// https://www.npmjs.com/package/@paralect/node-mongo?activeTab=explore

import { it, describe, expect, beforeAll, beforeEach, afterAll } from 'vitest';

import { Database } from '@paralect/node-mongo';

import { Book, bookSchema } from '../src/routes/books/schema';

import config from '../src/common/config';

import { v4 as uuidv4 } from 'uuid'

const database = new Database(config.mongo.connection);

const booksService = database.createService<Book>("books", {});

describe('Books service TEST SUITE', () => {

  beforeAll(async () => {
    await database.connect();
    await booksService.drop(true) // warning! Remove the collection
  });

  beforeEach(async () => {

  });

  it('should add a book to collection', async () => {
    const book = {
      id: uuidv4(),
      title: 'Great book!',
      published: true,
      content: 'This is a great book',
      tags: ['featured', 'popular', 'trending'],
      deleted: false
    };

    await booksService.validateSchema(bookSchema)

    await booksService.deleteOne({ id: book.id })

    await booksService.insertOne(book);

    const insertedBook = await booksService.findOne({ id: book.id });

    expect(insertedBook).toEqual(book);
  });

  it('should create and find a book', async () => {

    const book = {
      id: uuidv4(),
      title: 'Good book!',
      published: true,
      content: 'This is a good book',
      tags: ['featured'],
      deleted: false
    };

    await booksService.insertOne(book, { publishEvents: false },);

    const newBook = await booksService.findOne({ id: book.id });

    expect(book.id).toEqual(newBook?.id);
  });

  it('should create and find all books', async () => {
    const books = await booksService.insertMany([
      {
        id: uuidv4(),
        title: 'Better book!',
        published: true,
        content: 'This is an even better book',
        tags: ['featured', 'popular'],
        deleted: false
      },
      {
        id: uuidv4(),
        title: 'Great book!',
        published: true,
        content: 'This is a great book',
        tags: ['featured', 'popular', 'trending'],
        deleted: false
      }
    ]);

    const bookIds = books.map((book) => book.id);
    const { results: newBooks } = await booksService.find(
      {
        id: { $in: bookIds },
      }
    );

    const newBooksIds = newBooks.map((book) => book.id);

    expect(newBooksIds).to.have.members(bookIds);
  });

  it('should check deletesoft', async () => {

    const uuid = uuidv4()

    const book = await booksService.insertOne({
      id: uuid,
      title: 'Great book!',
      published: true,
      content: 'This is a very good book',
      tags: ['featured', 'popular'],
      deleted: false
    });

    await booksService.deleteSoft({
      id: uuid,
    });

    const notFoundBook = await booksService.findOne({ id: uuid });

    const foundBook = await booksService.findOne({ id: uuid },
      { skipDeletedOnDocs: false },
    );

    expect(notFoundBook).toBeNull()

    expect(foundBook?.id).to.be.eq(uuid);

  });

  it('should create and find books with paging', async () => {
    const books = await booksService.insertMany([
      { id: uuidv4(), title: 'Great book 1 !' },
      { id: uuidv4(), title: 'Great book 2 !' },
      { id: uuidv4(), title: 'Great book 3 !' },
      { id: uuidv4(), title: 'Great book 4 !' },
      { id: uuidv4(), title: 'Great book 5 !' },
      { id: uuidv4(), title: 'Great book 6 !' },
      { id: uuidv4(), title: 'Great book 7 !' },
      { id: uuidv4(), title: 'Great book 8 !' },
      { id: uuidv4(), title: 'Great book 9 !' },
      { id: uuidv4(), title: 'Great book 10!' },
    ]);

    const bookIds = books.map((u) => u.id);

    const { results: newBooks, pagesCount, count } = await booksService.find(
      { id: { $in: bookIds } },
      { page: 1, perPage: 2 },
    );

    expect(newBooks).toHaveLength(2);

    expect(pagesCount).to.be.eq(5);

    expect(count).to.be.eq(10);
  });

  it('should check that book exists', async () => {
    const book = await booksService.insertOne({ title: 'John The Lord' });

    const isBookExists = await booksService.exists({ id: book.id });
    const isNotBookExists = await booksService.exists({ id: 'some-id' });

    expect(isBookExists).toBeTruthy();
    expect(isNotBookExists).toBeFalsy()
  });

  it('should return books count', async () => {
    await booksService.insertMany([
      { title: 'John IM' },
      { title: 'John IM' },
      { title: 'John IM' },
      { title: 'John IM' },
    ]);

    const booksCount = await booksService.countDocuments({ title: 'John IM' });

    expect(booksCount).to.be.eq(4);
  });

  it('should return book titles', async () => {
    const booksData = [
      { title: 'John IMS 1' },
      { title: 'John IMS 2' },
      { title: 'John IMS 3' },
      { title: 'John IMS 4' },
    ];

    await booksService.insertMany(booksData);

    const newBooksFullNames = booksData.map((u) => u.title);

    const booksFullNames = await booksService.distinct('title', {
      title: { $in: newBooksFullNames },
    });

    expect(booksFullNames).to.have.members(newBooksFullNames);
  });

  it('should replace book', async () => {
    const book = await booksService.insertOne({
      title: 'Book to replace',
    });

    const titleToUpdate = 'Updated book title';

    await booksService.replaceOne(
      { id: book.id },
      { title: titleToUpdate },
    );

    const updatedBook = await booksService.findOne({ id: book.id });

    expect(updatedBook.title).to.be.eq(titleToUpdate);
  });

  it('should atomic update book', async () => {
    const book = await booksService.insertOne({
      title: 'Book to update',
    });

    const titleToUpdate = 'Updated book title';

    await booksService.atomic.updateOne(
      { id: book.id },
      { $set: { title: titleToUpdate } },
    );

    const updatedBook = await booksService.findOne({ id: book.id });

    expect(updatedBook.title).to.be.eq(titleToUpdate);
  });

  it('should atomic update books', async () => {

    await booksService.drop(true) // warning! Remove the collection

    const books = [
      { title: 'John' },
      { title: 'Kobe' },
    ];

    const titleToUpdate = 'Updated book title';

    const createdBooks = await booksService.insertMany(books);

    const booksIds = createdBooks.map((book) => book.id);

    await booksService.atomic.updateMany(
      { id: { $in: booksIds } },
      { $set: { title: titleToUpdate } },
    );

    const { results: updatedBooks } = await booksService.find({ id: { $in: booksIds } });

    const expectedTitles = updatedBooks.map(() => 'Updated book title');
    const updatedTitles = books.map(() => 'Updated book title');

    expect(expectedTitles).to.have.members(updatedTitles);

  });

  it('should update book', async () => {
    const u = await booksService.insertOne({
      title: 'Book to update',
    });

    const updatedBook = await booksService.updateOne(
      { id: u.id }, () => ({
        title: 'Updated book title',
      }),
    );

    expect(updatedBook.title).to.be.eq('Updated book title');
  });

  it('should update books', async () => {

    await booksService.drop(true) // warning! Remove the collection

    const books = [
      { title: 'John' },
      { title: 'Kobe' },
    ];

    const createdBooks = await booksService.insertMany(books);

    const booksIds = createdBooks.map((book) => book.id);

    const updatedBooks = await booksService.updateMany(
      { id: { $in: booksIds } },
      (doc) => ({
        title: `${doc.title} Updated book title`,
      }),
    );

    const expectedTitles = books.map((book) => `${book.title} Updated book title`);
    const updatedTitles = updatedBooks.map((book) => book.title);

    expect(updatedTitles).to.have.members(expectedTitles);

  });

  it('should delete book', async () => {

    await booksService.drop(true) // warning! Remove the collection

    const book = await booksService.insertOne({
      title: 'Book to remove 33',
    });

    await booksService.deleteOne({ id: book.id });

    const deletedBook = await booksService.findOne({
      id: book.id,
    });

    expect(deletedBook).to.be.null;
  });

  it('should delete books', async () => {
    const books = await booksService.insertMany([
      { title: 'Book to remove 11' },
      { title: 'Book to remove 22' },
    ]);

    const booksIds = books.map((book) => book.id);

    await booksService.deleteMany({ id: { $in: booksIds } });

    const { results: removedBooks } = await booksService.find({
      id: { $in: booksIds },
    });

    expect(removedBooks).toHaveLength(0);
  });

  it('should set deletedOn date to current JS date on remove', async () => {
    const book = await booksService.insertOne({
      title: 'Book to remove',
    });

    await booksService.deleteSoft({
      id: book.id,
    });

    const updatedBook = await booksService.findOne(
      { id: book.id },
      { skipDeletedOnDocs: false },
    );

    const deletedBook = await booksService.findOne({
      id: book.id,
    });

    expect(deletedBook).to.be.null;

    expect(updatedBook).toHaveProperty("deletedOn");
  });

  it.skip('should return sum of books through aggregation', async () => {
    const books = [
      { title: 'Claudio' },
      { title: 'Miriam' },
      { title: 'Clara' },
    ];

    const createdBooks = await booksService.insertMany(books);

    const booksIds = createdBooks.map((book) => book.id);

    const aggregationResult = await booksService.aggregate([
      { $match: { id: { $in: booksIds } } },
      { $group: { id: null, count: { $sum: 1 } } },
    ]);

    // aggregationResult[0].count.should.be.equal(books.length);
    expect(aggregationResult[0].count).to.be.eq(books.length)
  });

  it('should create and delete index', async () => {
    const index = await booksService.createIndex({ title: 1 }) as string;

    const isIndexExists = await booksService.indexExists(index);

    await booksService.dropIndex(index);

    const isIndexNotExists = await booksService.indexExists('title');

    expect(isIndexExists).toBeTruthy
    expect(isIndexNotExists).toBeFalsy
  });

  it('should create and delete indexes', async () => {
    const indexes = await booksService.createIndexes([
      { key: { title: 1 } },
      { key: { createdOn: 1 } },
    ]) as string[];

    const isIndexesExists = await booksService.indexExists(indexes);

    await booksService.dropIndexes();

    const isIndexesNotExists = await booksService.indexExists(indexes);

    expect(isIndexesExists).toBeTruthy
    expect(isIndexesNotExists).toBeFalsy
  });

  //TODO: to be run this test should be create another service
  //it('should commit transaction', async () => {
  // const { book, company } = await database.withTransaction(async (session) => {
  //   const createdBook = await booksService.insertOne({ title: 'Bahrimchuk' }, {}, { session });
  //   const createdCompany = await companyService.insertOne(
  //     { books: [createdBook.id] }, {},
  //     { session },
  //   );

  //   return { book: createdBook, company: createdCompany };
  // });

  // const expectedBook = await booksService.findOne({ id: book.id });
  // const expectedCompany = await companyService.findOne({ id: company.id });

  // book.id.should.be.equal(expectedBook?.id);
  // company.id.should.be.equal(expectedCompany?.id);
  //});

  //TODO: to be run this test should be create another service
  //it('should rollback transaction', async () => {
  // try {
  //   await database.withTransaction(async (session) => {
  //     const createdBook = await booksService.insertOne({ title: 'Fake Bahrimchuk' }, {}, { session });

  //     await companyService.insertOne(
  //       { books: [createdBook.id], unExistedField: 3 } as any,
  //       {}, { session },
  //     );
  //   });
  // } catch (err) {
  //   const book = await booksService.findOne({ title: 'Fake Bahrimchuk' });

  //   (book === null).should.be.equal(true);
  // }
  //});

  it('should be repopulate the collection with 5 books', async () => {

    await booksService.drop(true) // warning! Remove the collection

    const books = await booksService.insertMany([
      {
        id: uuidv4(),
        title: 'Good book!',
        published: true,
        content: 'This is a good book',
        tags: ['featured'],
        deleted: false
      },
      {
        id: uuidv4(),
        title: 'Better book!',
        published: true,
        content: 'This is an even better book',
        tags: ['featured', 'popular'],
        deleted: false
      },
      {
        id: uuidv4(),
        title: 'Great book!',
        published: true,
        content: 'This is a great book',
        tags: ['featured', 'popular', 'trending'],
        deleted: false
      },
      {
        id: uuidv4(),
        title: 'Best book!',
        published: true,
        content: 'This is a best book',
        tags: ['featured', 'popular', 'trending'],
        deleted: false
      },
      {
        id: uuidv4(),
        title: 'Low level book!',
        published: false,
        content: 'This is a low level book',
        tags: ['featured', 'popular', 'trending'],
        deleted: true
      }
    ])

    const { results, count } = await booksService.find({});

    console.dir(results)

    expect(count).to.be.eq(5);

  })

  afterAll(async () => {
    await database.close();
  })

});
