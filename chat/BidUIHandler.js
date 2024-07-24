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

import { UIElement } from "../core/UIElement.js";
import {ChatMessageDetail, PlacePriceDetail, RoomDetail} from "../core/DTOs.js";
import {triggerLocalEvent, addEventHandler} from "../core/utils.js";
import {SwarmCommand} from "../swarm/swarmCommand.js";
import {ChatUICommand} from "./ChatUICommand.js";


import {Elements} from "../elements.js";
import {bidManager} from "../bid/bidManager.js";

export class BidUIHandler {
    constructor() {
        this.roomTopicUI = new UIElement(`#${Elements.BidDetails.TOPIC}`);
        this.loadingUI = new UIElement(`#${Elements.Sections.LOADING}`);
        this.welcomeUI = new UIElement(`#${Elements.Sections.SETUP}`);
        this.chatUI = new UIElement(`#${Elements.Sections.BID}`);
        this.txtChatTopic = new UIElement(`#${Elements.TextFields.JOIN_ROOM}`);
        this.txtPriceInput = new UIElement(`#${Elements.TextFields.BID_PRICE_INPUT}`);
        this.optItemSelect = new UIElement(`#${Elements.TextFields.ITEM_SELECT}`);
        this.listMessageUI = new UIElement(`#${Elements.BidDetails.MESSAGES}`);
        this.peerCountUI = new UIElement(`#${Elements.BidDetails.PEERS_COUNT}`);
        this.btnCreateRoom = new UIElement(`#${Elements.Buttons.CREATE_ROOM}`);
        this.btnJoinRoom = new UIElement(`#${Elements.Buttons.JOIN_ROOM}`);
        this.btnPlacePrice = new UIElement(`#${Elements.Buttons.BID_SEND}`);
        this.btnCloseBid = new UIElement(`#${Elements.Buttons.BID_CLOSE}`);
        this.txtSellerPublicKey = new UIElement(`#${Elements.TextFields.BID_USER_INPUT}`);
        this.btnCreateBid = new UIElement(`#${Elements.Buttons.BID_CREATE}`);
        this.btnCreateRoom.onClick(e => {
            e.preventDefault()
            triggerLocalEvent(ChatUICommand.CREATE_ROOM)
        });
        this.btnJoinRoom.onClick(e => {
            e.preventDefault();
            const topicStr = this.txtChatTopic.getText();
            triggerLocalEvent(ChatUICommand.JOIN_ROOM, new RoomDetail(topicStr));
        });
        this.btnPlacePrice.onClick(e => {
            e.preventDefault();
            const sellerPubKey = this.txtSellerPublicKey.getText();
            const itemId = this.optItemSelect.value();
            const price = this.txtPriceInput.getText();
            if (price && sellerPubKey && itemId) {
                triggerLocalEvent(ChatUICommand.UI_PLACE_PRICE, new PlacePriceDetail(
                    sellerPubKey, itemId, price)
                );
                this.txtPriceInput.setText('');
            } else {
                triggerLocalEvent(SwarmCommand.SEND_MESSAGE_LOCALLY, new ChatMessageDetail('ERROR', "Invalid input for placing price!"));
            }
        });
        this.btnCreateBid.onClick(e => {
            e.preventDefault();
            try {
                const price = this.txtPriceInput.getText();
                const selectedItem = this.optItemSelect.value();
                const message = bidManager.createBid(selectedItem, price)
                triggerLocalEvent(ChatUICommand.UI_UPDATE_BID, new ChatMessageDetail('All', message));
                this.txtPriceInput.setText('');
            } catch (e) {
                const message = e.message
                triggerLocalEvent(SwarmCommand.SEND_MESSAGE_LOCALLY, new ChatMessageDetail('ERROR', message));
            }
        })
        this.btnCloseBid.onClick(e => {
            e.preventDefault();
            try {
                const selectedItem = this.optItemSelect.value();
                const message = bidManager.closeBid(selectedItem)
                triggerLocalEvent(ChatUICommand.UI_UPDATE_BID, new ChatMessageDetail('All', message));
                this.txtPriceInput.setText('');
            } catch (e) {
                const message = e.message
                triggerLocalEvent(SwarmCommand.SEND_MESSAGE_LOCALLY, new ChatMessageDetail('ERROR', message));
            }
        });
        addEventHandler(SwarmCommand.SEND_MESSAGE_LOCALLY, this.onMessageAdded);
        addEventHandler(SwarmCommand.SHOW_LOADING, this.showLoading);
        addEventHandler(SwarmCommand.SHOW_BID_ROOM, this.showChatRoom);
        addEventHandler(SwarmCommand.UPDATE_PEER_COUNT, (e) => this.updatePeerCount(e.detail));

        addEventHandler(SwarmCommand.SHOW_SELLER_UI, ()=> {
            this.txtSellerPublicKey.hide()
            this.btnPlacePrice.hide()
        });
        addEventHandler(SwarmCommand.SHOW_BUYER_UI, ()=> {
            this.btnCreateBid.hide()
            this.btnCloseBid.hide()
        });
    }

    showLoading = () => {
        this.welcomeUI.hide();
        this.loadingUI.show();
    };

    showChatRoom = event => {
        const { topic } = event.detail;
        console.log({topic})
        this.roomTopicUI.setText(topic);
        this.loadingUI.hide();
        this.chatUI.show();
    };

    updatePeerCount = peerCount => {
        this.peerCountUI.setText(peerCount);
    };

    onMessageAdded = event => {
        const { from, message } = event.detail;
        const $div = document.createElement('div');
        $div.textContent = `<${from}> ${message}`;
        this.listMessageUI.appendChild($div);
        const messageList = this.listMessageUI.element()
        messageList.scrollTop = messageList.scrollHeight;
    };
}
