const truffleAssert = require("truffle-assertions");
const BookStore = artifacts.require("BookStore");
const StoreFront = artifacts.require("StoreFront");
const PurchaseToken = artifacts.require("PurchaseToken");

contract("BookStore", (accounts) => {
  describe("Publishing", async () => {
    it("gives the author the specified amount of book version copies", async () => {
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await storeFront.setBookStore(bookStore.address);
      await bookStore.setStoreFront(storeFront.address);
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
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await storeFront.setBookStore(bookStore.address);
      await bookStore.setStoreFront(storeFront.address);

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
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await storeFront.setBookStore(bookStore.address);
      await bookStore.setStoreFront(storeFront.address);
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
  describe("Purchasing from the author", async () => {
    it("transfers a purchase token to the author", async () => {
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await storeFront.setBookStore(bookStore.address);
      await bookStore.setStoreFront(storeFront.address);

      const buyer = accounts[1];
      const purcahseToken = await PurchaseToken.new(
        web3.utils.toWei("1000000", "ether"),
        { from: buyer }
      );
      let balance = await purcahseToken.balanceOf(buyer);
      balance = web3.utils.fromWei(balance, "ether");
      assert.equal(balance, "1000000");

      await purcahseToken.approve(
        storeFront.address,
        web3.utils.toWei("1000000", "ether"),
        { from: buyer }
      );
      //   const bookID = 1;
      let bookPrice = web3.utils.toWei("5000", "ether");
      const bookCurrency = purcahseToken.address;
      const bookQuantity = 10;
      const author = accounts[5];
      await bookStore.publish(bookQuantity, bookPrice, bookCurrency, {
        from: author,
      });
      await bookStore.setApprovalForAll(storeFront.address, true, {
        from: author,
      });
      await storeFront.purchaseFromAuthor(1, { from: buyer });

      let authorBalance = web3.utils.fromWei(
        await purcahseToken.balanceOf(author),
        "ether"
      );
      assert.equal(authorBalance, "5000");
    });
    it("transfers a book version to the buyer", async () => {
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await storeFront.setBookStore(bookStore.address);
      await bookStore.setStoreFront(storeFront.address);

      const buyer = accounts[1];
      const purcahseToken = await PurchaseToken.new(
        web3.utils.toWei("1000000", "ether"),
        { from: buyer }
      );

      purcahseToken.transfer(accounts[9], web3.utils.toWei("500000", "ether"), {
        from: buyer,
      });
      await purcahseToken.approve(
        storeFront.address,
        web3.utils.toWei("1000000", "ether"),
        { from: buyer }
      );
      await purcahseToken.approve(
        storeFront.address,
        web3.utils.toWei("1000000", "ether"),
        { from: accounts[9] }
      );
      //   const bookID = 1;
      let bookPrice = web3.utils.toWei("50", "ether");
      const bookCurrency = purcahseToken.address;
      const bookQuantity = 100;
      const author = accounts[5];
      await bookStore.publish(bookQuantity, bookPrice, bookCurrency, {
        from: author,
      });
      await bookStore.setApprovalForAll(storeFront.address, true, {
        from: author,
      });
      await storeFront.purchaseFromAuthor(1, { from: buyer });

      let bookVersionBalance = parseInt(await bookStore.balanceOf(buyer, 1));
      assert.equal(bookVersionBalance, 1);

      await storeFront.purchaseFromAuthor(1, { from: accounts[9] });

      bookVersionBalance = parseInt(await bookStore.balanceOf(accounts[9], 1));
      assert.equal(bookVersionBalance, 1);
    });
  });
  describe("Security", async () => {
    it("won't allow anyone but the storeFront to call BookStore#transferFromAuthor", async () => {
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await storeFront.setBookStore(bookStore.address);
      await bookStore.setStoreFront(storeFront.address);

      //   const bookID = 1;
      const bookPrice = web3.utils.toWei("50", "ether");
      const bookCurrency = "0x95Ba4cF87D6723ad9C0Db21737D862bE80e93911"; //USDC
      const bookQuantity = 100;
      const author = accounts[5];
      await bookStore.publish(bookQuantity, bookPrice, bookCurrency, {
        from: author,
      });

      await truffleAssert.reverts(
        bookStore.transferFromAuthor(accounts[3], 1, {
          from: accounts[3],
        }),
        "Message can only be called from storefront"
      );
    });

    it("won't allow anyone but the contract owner to set the storefront", async () => {
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await storeFront.setBookStore(bookStore.address);
      await truffleAssert.reverts(
        bookStore.setStoreFront(storeFront.address, { from: accounts[7] }),
        "BookStore: Only contract owner can set storefront"
      );
    });

    it("won't allow anyone but the contract owner to set the bookstore", async () => {
      const storeFront = await StoreFront.new();
      const bookStore = await BookStore.new();

      await truffleAssert.reverts(
        storeFront.setBookStore(bookStore.address, { from: accounts[7] }),
        "StoreFront: Only contract owner can set bookstore"
      );
    });
  });
});
