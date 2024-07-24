/*
 * Copyright (c) 2024 Vinh Vu
 * Email: mrthanhvinh168@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * This source code is the property of Vinh Vu. It cannot be re-used or shared
 * with anyone else without his consent.
 */

import {BidData} from "./bidData.js";

class ItemBidAlreadyCreated extends Error {
    constructor(message = `You already created bid for this item`) {
        super(message);
    }
}
class CannotPlacePriceForYourOwnItem extends Error {
}
class UserDoesNotOwnItem extends Error {
}

class PriceIsLowerThanCurrent extends Error {
    constructor(buyer, itemId) {
        super(`You placed a price that equal to or lower than the current price for item ${itemId}`);
    }
}
class BidIsClosedAlready extends Error {
    constructor(message = 'This bid is closed already') {
        super(message);
    }
}
class ItemDoesNotExist extends Error {
    constructor(message = 'This item doesn\'t exist!') {
        super(message);
    }
}
const BidStatus = {
    OPEN: "open",
    CLOSED: "closed"
}

class BidManager
{
    get owner() {
        return this._owner;
    }

    set owner(value) {
        this._owner = value;
    }

    get itemIds() {
        return this._itemIds;
    }

    set itemIds(value) {
        this._itemIds = value;
    }

    get bids() {
        return this._bids;
    }

    set bids(value) {
        this._bids = value;
    }
    constructor(owner, itemIds, bids) {
        this._owner = owner
        this._bids = bids || {}
        this._itemIds = itemIds || {}
    }

    getCurrentBidData = () => this._bids
    createBid = (itemId, price) => {
        price = this.validatePrice(price)
        this._bids[itemId] = new BidData(
            this._owner,
            itemId,
            price
        )
        return `User ${this._owner} is selling item: ${itemId} with price ${price}!`
    }

    placePrice = (buyer, itemId, price) => {
        price = this.validatePrice(price)
        const bid = this.validateItemIdExist(itemId)
        if (bid.originalOwner === buyer) {
            throw new CannotPlacePriceForYourOwnItem()
        }
        if (price <= bid.price) {
            throw new PriceIsLowerThanCurrent(buyer, itemId)
        }
        bid.price = price
        bid.potentialOwner = buyer
        return `User ${buyer} has placed price ${price} on item: ${itemId}!`
    }

    closeBid = (itemId) => {
        const bid = this.validateItemIdExist(itemId)
        if (this._owner !== bid.originalOwner) {
            throw new UserDoesNotOwnItem()
        }
        bid.status = BidStatus.CLOSED
        return `The original owner ${bid.originalOwner} of item: ${itemId} has closed the bid, 
        ${bid.potentialOwner?`User ${bid.potentialOwner}`:"Nobody"} has won the item!`
    };

    validateItemIdExist(itemId) {
        if (!this._bids.hasOwnProperty(itemId)) {
            throw new ItemDoesNotExist()
        }
        const bidData = this._bids[itemId]
        if (bidData.status === BidStatus.CLOSED) {
            throw new BidIsClosedAlready()
        }
        return bidData
    }

    validatePrice = (price) => {
        // Convert the price to a number
        const numberPrice = Number(price);

        // Check if the price is a valid number and greater than 0
        if (!isNaN(numberPrice) && numberPrice > 0) {
            return price
        } else {
            throw new Error("Invalid price for creating bid!");
        }
    }
}

const bidManager = new BidManager()
export {bidManager, BidStatus}