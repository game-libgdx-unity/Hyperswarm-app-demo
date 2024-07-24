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

import { CSS_CLASSES, EventType } from "./constants.js";

export class UIElement {
    constructor(selector) {
        this.selector = selector;
    }

    element() {
        return document.querySelector(this.selector);
    }

    show() {
        this.element().classList.remove(CSS_CLASSES.Hidden);
    }

    hide() {
        this.element().classList.add(CSS_CLASSES.Hidden);
    }

    setText(text) {
        const el = this.element();
        if (el.value !== undefined) {
            el.value = text;
        } else {
            el.innerText = text;
        }
    }

    getText() {
        const el = this.element();
        return el.innerText || el.value;
    }

    appendChild(element) {
        this.element().appendChild(element);
    }

    onClick(callback) {
        this.element().addEventListener(EventType.CLICK, callback);
    }

    onSubmit(callback) {
        this.element().addEventListener(EventType.SUBMIT, callback);
    }

    addEventListener(eventType, callback) {
        this.element().addEventListener(eventType, callback);
    }

    value() {
        return this.element().value;
    }
}
