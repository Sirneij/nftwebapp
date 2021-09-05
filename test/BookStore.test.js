const BookStore = artifacts.require("BookStore");

contract("BookStore", (accounts) => {
  describe("Publishing", async () => {
    it("gives the author the specified amount of book version copies", async () => {
      const bookStore = await BookStore.new();
      //   const bookID = 1;
      const bookPrice = web3.utils.toWei("50", "ether");
      const bookCurrency = "0x95Ba4cF87D6723ad9C0Db21737D862bE80e93911"; //USDC
      const bookQuantity = 100;
      const author = accounts[5];
      await bookStore.publish(bookQuantity, bookPrice, bookCurrency, {
        from: author,
      });
      let authorBalance = await bookStore.balanceOf(author, 1);
      authorBalance = parseInt(authorBalance);
      assert.equal(authorBalance, 100);
    });
    it("increases book ID", async () => {
      const bookStore = await BookStore.new();
      const bookPrice = web3.utils.toWei("50", "ether");
      const bookCurrency = "0x95Ba4cF87D6723ad9C0Db21737D862bE80e93911"; //USDC
      const author = accounts[5];
      await bookStore.publish(75, bookPrice, bookCurrency, { from: author });
      await bookStore.publish(50, bookPrice, bookCurrency, { from: author });
      let authorBalance = await bookStore.balanceOf(author, 2);
      authorBalance = parseInt(authorBalance);
      assert.equal(authorBalance, 50);
    });
    it("correctly sets the price and currency for a book version", async () => {
      const bookStore = await BookStore.new();
      //   const bookID = 1;
      let bookPrice = web3.utils.toWei("50", "ether");
      const bookCurrency = "0x95Ba4cF87D6723ad9C0Db21737D862bE80e93911"; //USDC
      const bookQuantity = 100;
      const author = accounts[5];
      await bookStore.publish(bookQuantity, bookPrice, bookCurrency, {
        from: author,
      });
      let bookVersionPrice = await bookStore.bookVersionPrice(1);
      bookVersionPrice = web3.utils.fromWei(bookVersionPrice, "ether");
      assert.equal(bookVersionPrice, "50");

      bookPrice = web3.utils.toWei("100", "ether");
      await bookStore.publish(bookQuantity, bookPrice, bookCurrency, {
        from: author,
      });
      bookVersionPrice = await bookStore.bookVersionPrice(2);
      bookVersionPrice = web3.utils.fromWei(bookVersionPrice, "ether");
      assert.equal(bookVersionPrice, "100");

      let bookVersionCurrency = await bookStore.bookVersionCurrency(2);
      // bookVersionPrice = web3.utils.fromWei(bookVersionPrice, "ether");
      assert.equal(
        bookVersionCurrency,
        "0x95Ba4cF87D6723ad9C0Db21737D862bE80e93911"
      );
    });
  });
});
