import {BidStatus} from "./bidManager.js";

export class BidData {
    constructor(owner, itemId, price) {
        this.originalOwner = owner
        this.potentialOwner = undefined
        this.itemId = itemId
        this.price = price
        this.status = BidStatus.OPEN
    }
}