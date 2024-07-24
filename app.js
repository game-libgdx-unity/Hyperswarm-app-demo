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

import {BidUIHandler} from "./chat/BidUIHandler.js";
import {SwarmHandler} from "./swarm/swarmHandler.js";
import {UIBuilder} from "./UIBuilder.js";
import {Elements} from "./elements.js";

document.addEventListener('DOMContentLoaded', () => {
    const uiTexts = {
        [Elements.Buttons.CREATE_ROOM]: 'Join the default Room',
        [Elements.Buttons.JOIN_ROOM]: 'Join Existing Room',
        [Elements.Buttons.BID_CLOSE]: 'Close Bid',
        [Elements.Buttons.BID_CREATE]: 'Create Bid',
        [Elements.Buttons.BID_SEND]: 'Place Bid',
        [Elements.Dividers.OR]: 'or',
        [Elements.TextFields.JOIN_ROOM]: 'Enter Room Topic',
        [Elements.Sections.LOADING]: 'Please wait...',
        [Elements.BidDetails.Labels.BID_TOPIC]: 'Current Topic: ',
        [Elements.BidDetails.Labels.PEERS_COUNT]: 'Participants: ',
        [Elements.BidDetails.PEERS_COUNT]: '0',
        [Elements.Labels.WELCOME]: 'Welcome to the Bid!',
    };
    new UIBuilder().buildBidUI({
        uiTexts: uiTexts,
    });
    // window. = here is for easier debug and test. Can remove in production
    window.chatUI = new BidUIHandler();
    window.swarmHandler = new SwarmHandler();
});
