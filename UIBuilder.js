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

import { create } from './core/create.js';
import { Elements } from './elements.js';

export class UIBuilder {
    buildBidUI = ({ uiTexts}) => {
        if (!this.ui) {
            this.ui = create({
                uiTexts,
                tag: 'main',
                children: [
                    createSetupSection({ uiTexts }),
                    createLoadingSection(),
                    createBidSection()
                ]
            });
        }
        return this.ui;
    }
}

const createSetupSection = ({ uiTexts }) => ({
    id: Elements.Sections.SETUP,
    children: [
        {
            klass: 'flex-center',
            children: [
                { tag: 'h3', id: Elements.Labels.WELCOME },
                { tag: 'button', id: Elements.Buttons.CREATE_ROOM }
            ]
        },
        { id: Elements.Dividers.OR },
        {
            tag: 'form',
            id: Elements.Forms.JOIN_ROOM,
            children: [
                {
                    tag: 'input',
                    id: Elements.TextFields.JOIN_ROOM,
                    placeholder: uiTexts[Elements.TextFields.JOIN_ROOM],
                },
                { tag: 'button', type: 'submit', id: Elements.Buttons.JOIN_ROOM },
            ]
        }
    ]
});

const createLoadingSection = () => ({
    id: Elements.Sections.LOADING,
    klass: 'hidden'
});

const createBidSection = () => ({
    id: Elements.Sections.BID,
    klass: 'hidden',
    children: [
        {
            id: Elements.BidDetails.HEADER,
            children: [
                {
                    id: Elements.BidDetails.DETAILS,
                    children: [
                        {
                            children: [
                                { id: Elements.BidDetails.Labels.BID_TOPIC, klass: 'bid-topic-label' },
                                { tag: 'span', id: Elements.BidDetails.TOPIC }
                            ]
                            , klass: 'flex-left'
                        },
                        {
                            children: [
                                { id: Elements.BidDetails.Labels.PEERS_COUNT, klass: 'bid-topic-label' },
                                { tag: 'span', id: Elements.BidDetails.PEERS_COUNT }
                            ]
                            , klass: 'flex-left'
                        }
                    ]
                }
            ]
        },
        { id: Elements.BidDetails.MESSAGES },
        {
            tag: 'form',
            id: Elements.Forms.MESSAGE,
            children: [
                {
                    tag: 'button',
                    type: 'submit',
                    id: Elements.Buttons.BID_CLOSE,
                },
                {
                    tag: 'select',
                    id: Elements.TextFields.ITEM_SELECT,
                    children: [
                        { tag: 'option', value: 'item1', html: 'Item 1', selected: "true" },
                        { tag: 'option', value: 'item2', html: 'Item 2' },
                        { tag: 'option', value: 'item3', html: 'Item 3' }
                    ]
                },
                {
                    tag: 'input',
                    id: Elements.TextFields.BID_USER_INPUT,
                    type: 'text',
                    placeholder: 'Enter USER PUBKEY'
                },
                {
                    tag: 'input',
                    id: Elements.TextFields.BID_PRICE_INPUT,
                    type: 'text',
                    placeholder: 'Enter Bid Price'
                },
                {
                    tag: 'button',
                    type: 'submit',
                    id: Elements.Buttons.BID_SEND,
                },
                {
                    tag: 'button',
                    type: 'submit',
                    id: Elements.Buttons.BID_CREATE,
                },
            ]
        }
    ]
});
