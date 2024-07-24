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

export const create = function ({
                                    tagName = null,
                                    tag = null,
                                    id,
                                    children,
                                    className,
                                    klass,
                                    style,
                                    css,
                                    textContent,
                                    text,
                                    htmlContent: innerText,
                                    html,
                                    listeners,
                                    events,
                                    click,
                                    childrenElements,
                                    child,
                                    uiTexts,
                                    placeholder,
                                    ...attrs
                                }) {
    if (tag) {
        tagName = tag;
    }
    if (!tagName) {
        tagName = "div";
    }
    const element = document.createElement(tagName);
    if (tagName === 'input' && placeholder) {
        element.placeholder = placeholder;
    }
    if (className) element.className = className;
    else if (klass) element.className = klass;
    if (id) {
        element.id = id;
        // If there's no text provided, use text from uiTexts if available
        if (!textContent && !text && uiTexts && uiTexts[id]) {
            element.textContent = uiTexts[id];
        } else {
            if (textContent) {
                element.textContent = textContent;
            } else if (text) {
                element.text = text;
            }
        }
    }
    if (style) element.style.cssText = style;
    else if (css) element.style.cssText = css;
    if (innerText) element.innerHTML = innerText;
    else if (html) element.innerHTML = html;
    if (click) {
        element.addEventListener('click', click);
    } else {
        if (events) {
            listeners = events;
        }
        if (listeners) {
            if (typeof listeners === 'function') {
                element.addEventListener('click', listeners);
            } else {
                listeners.forEach(listener => {
                    const {event, handler} = listener;
                    element.addEventListener(event, handler);
                });
            }
        }
    }
    if (child) {
        element.create(child);
    } else {
        if (children) {
            childrenElements = children;
        }
        if (childrenElements) {
            childrenElements.forEach(childConfig => {
                element.create({...childConfig, uiTexts}); // Pass uiTexts down
            });
        }
    }
    //set custom attrs
    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            element.setAttribute(key, value);
        }
    }

    try {
        this.appendChild(element);
    } catch (e) {
        document.body.appendChild(element);
    }
    return element;
};

Element.prototype.create = create;
