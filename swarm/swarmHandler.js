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

import Hyperswarm from "hyperswarm";
import b4a from "b4a";
import Buffer from "b4a";
import crypto from "hypercore-crypto";
import {addEventHandler, triggerLocalEvent} from "../core/utils.js";
import {ChatMessageDetail, RoomDetail, SwarmMessageDetail} from "../core/DTOs.js";
import {SwarmCommand} from "./SwarmCommand.js";
import {ChatUICommand} from "../chat/ChatUICommand.js";
import {bidManager} from "../bid/bidManager.js";

const { teardown } = Pear;

// console.log(b4a.from('hello world', 'hex'))

export class SwarmHandler {
    constructor() {
        this.swarm = new Hyperswarm();
        teardown(() => this.swarm.destroy());
        this.swarm.on('connection', this.handleConnection);
        this.swarm.on('update', () => {
            this.updatePeerCount(this.swarm.connections.size);

        });

        addEventHandler(ChatUICommand.CREATE_ROOM, this.createDefaultRoom);
        addEventHandler(ChatUICommand.JOIN_ROOM, (e) => this.joinRoom(e.detail.topic));
        addEventHandler(ChatUICommand.UI_UPDATE_BID, (e) => {
            this.sendMessageForAll(e.detail.from, e.detail.message)
        });
        addEventHandler(ChatUICommand.UI_PLACE_PRICE, (e) => {
            const sellerPubKey = e.detail.sellerPubKey
            if (sellerPubKey !== bidManager.owner) {
                this.sendCommandForOne(sellerPubKey, SwarmCommand.PEER_PLACE_PRICE, e.detail)
            } else {
                this.dispatchMessageLocally("ERROR", "You cannot place price for your own bid");
            }
        });
    }

    // handler commands over the network
    swarmCommandHandlers = {
        [SwarmCommand.SEND_MESSAGE_LOCALLY]: (publicKey, data) => {
            const name = publicKey.slice(0, 6)
            this.dispatchMessageLocally(name, data)
        },
        [SwarmCommand.PEER_PLACE_PRICE]: (publicKey, data) => {
            if (publicKey !== bidManager.owner) {
                let result;
                try {
                    // if it's successful, update everyone in the room about it
                    result = bidManager.placePrice(publicKey, data.itemId, data.price)
                    this.sendMessageForAll('ALL', result)
                } catch (e) {
                    // if it's failed, send message back to the requester
                    result = e.message;
                    this.sendCommandForOne(publicKey, 'ERROR', result)
                }
            } else {
                // for local logic check, it won't be happened though
                this.dispatchMessageLocally("ERROR", "You cannot place price for your own bid");
            }
        },
        ['ERROR']: (publicKey, data) => {
            this.dispatchMessageLocally("ERROR", data);
        }
    };

    handleConnection = peer => {
        let peerPublicKey = b4a.toString(peer.remotePublicKey, 'hex');
        peer.on('data', message =>{
            const { command, data} = JSON.parse(message)
            if (command) {
                if (this.swarmCommandHandlers[command]) {
                    this.swarmCommandHandlers[command](peerPublicKey, data);
                } else {
                    console.log(`No handler for command ${command}`);
                }
            }
        });
        peer.on('error', e => {
            console.log(`Connection error: ${e}`)
            this.updatePeerCount(this.swarm.connections.size);
        });
    };

    createDefaultRoom = async () => {
        const hashed = crypto.hash(Buffer.from('%$#__defaultbidingroom__#@#', 'utf8'));
        // const hashed = crypto.randomBytes(32)
        await this.joinSwarm(hashed)
    };

    joinRoom = async topicStr => {
        const topicBuffer = b4a.from(topicStr, 'hex');
        await this.joinSwarm(topicBuffer)
    };

    joinSwarm = async topicBuffer => {
        triggerLocalEvent(SwarmCommand.SHOW_LOADING)
        const discovery = this.swarm.join(topicBuffer, { client: true, server: true })
        await discovery.flushed()
        const topic = b4a.toString(topicBuffer, 'hex')
        triggerLocalEvent(SwarmCommand.SHOW_BID_ROOM, new RoomDetail(topic))
        let currentUser = b4a.toString(this.swarm.server.publicKey, 'hex')
        if (!bidManager.owner) {
            bidManager.owner = currentUser
        }
        console.log("current size " + this.swarm.connections.size)
        if (this.swarm.connections.size === 0) {  //this case we're the seller
            triggerLocalEvent(SwarmCommand.SHOW_SELLER_UI)
        } else {  //this case we're the buyer
            triggerLocalEvent(SwarmCommand.SHOW_BUYER_UI)
        }
    }

    sendMessageForAll = (from, message) => {
        this.broadcastCommandForAll(SwarmCommand.SEND_MESSAGE_LOCALLY, message);
        this.dispatchMessageLocally(from, message);
    }

    sendMessageForOne = (pubkey, from, message) => {
        this.sendCommandForOne(pubkey, SwarmCommand.SEND_MESSAGE_LOCALLY, message);
    }


    dispatchMessageLocally = (from, message) => {
        triggerLocalEvent(SwarmCommand.SEND_MESSAGE_LOCALLY, new ChatMessageDetail(from, message));
    }

    updatePeerCount = peerCount => {
        triggerLocalEvent(SwarmCommand.UPDATE_PEER_COUNT, peerCount);
    }

    broadcastCommandForAll = (command, data) => {
        for (const peer of this.swarm.connections) {
            peer.write(JSON.stringify(new SwarmMessageDetail(command, data)));
        }
    }
    sendCommandForOne = (publicKey, command, data) => {
        const peer = [...this.swarm.connections].find(p => b4a.equals(
            p.remotePublicKey,
            b4a.from(publicKey, 'hex')
        ));
        if (!peer) {
            throw new Error('Peer not found');
        }
        peer.write(JSON.stringify(new SwarmMessageDetail(command, data)));
    }
}
