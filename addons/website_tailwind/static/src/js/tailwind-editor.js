/* Tailwind CSS Website Editor Integration */

odoo.define('website_tailwind.editor', function (require) {
    'use strict';

    var core = require('web.core');
    var Widget = require('web.Widget');
    var websiteNavbarData = require('website.navbar');

    var _t = core._t;

    /**
     * Tailwind CSS Editor Panel
     */
    var TailwindEditorPanel = Widget.extend({
        template: 'website_tailwind.editor_panel',
        
        events: {
            'click .tailwind-class-btn': '_onClassButtonClick',
            'input .utility-search input': '_onUtilitySearch',
            'click .utility-item': '_onUtilityItemClick',
            'click .color-swatch': '_onColorSwatchClick',
            'input .spacing-control input': '_onSpacingChange',
            'change .typography-control select': '_onTypographyChange',
            'click .layout-option': '_onLayoutOptionClick',
            'click .breakpoint-tab': '_onBreakpointTabClick',
        },

        init: function (parent, options) {
            this._super.apply(this, arguments);
            this.selectedElement = null;
            this.currentBreakpoint = 'base';
            this.utilityClasses = this._getUtilityClasses();
        },

        start: function () {
            this._super.apply(this, arguments);
            this._initializePanel();
            return this._super.apply(this, arguments);
        },

        /**
         * Initialize the editor panel
         */
        _initializePanel: function () {
            this._renderColorPalette();
            this._renderUtilityList();
            this._bindElementSelection();
        },

        /**
         * Render color palette
         */
        _renderColorPalette: function () {
            var colors = this._getColorPalette();
            var $palette = this.$('.color-palette');
            
            colors.forEach(function (color) {
                var $swatch = $('<div>')
                    .addClass('color-swatch')
                    .css('background-color', color.value)
                    .attr('data-color', color.class)
                    .attr('title', color.name);
                $palette.append($swatch);
            });
        },

        /**
         * Render utility class list
         */
        _renderUtilityList: function () {
            var $list = this.$('.utility-list');
            
            this.utilityClasses.forEach(function (utility) {
                var $item = $('<div>')
                    .addClass('utility-item')
                    .attr('data-class', utility.class);
                
                var $className = $('<div>')
                    .addClass('class-name')
                    .text(utility.class);
                
                var $description = $('<div>')
                    .addClass('description')
                    .text(utility.description);
                
                $item.append($className, $description);
                $list.append($item);
            });
        },

        /**
         * Bind element selection in the website editor
         */
        _bindElementSelection: function () {
            var self = this;
            
            // Listen for element selection events from website editor
            $(document).on('website_editor.element_selected', function (event, element) {
                self._onElementSelected(element);
            });
        },

        /**
         * Handle element selection
         */
        _onElementSelected: function (element) {
            this.selectedElement = element;
            this._updatePanelForElement(element);
        },

        /**
         * Update panel based on selected element
         */
        _updatePanelForElement: function (element) {
            if (!element) return;
            
            var classes = element.className.split(' ');
            var tailwindClasses = classes.filter(function (cls) {
                return cls.startsWith('tw-') || this._isTailwindClass(cls);
            }.bind(this));
            
            this._highlightActiveClasses(tailwindClasses);
            this._updatePreview(element);
        },

        /**
         * Highlight active classes in the panel
         */
        _highlightActiveClasses: function (classes) {
            this.$('.tailwind-class-btn').removeClass('active');
            
            classes.forEach(function (cls) {
                this.$('.tailwind-class-btn[data-class="' + cls + '"]').addClass('active');
            }.bind(this));
        },

        /**
         * Update preview panel
         */
        _updatePreview: function (element) {
            var $preview = this.$('.preview-element');
            $preview.attr('class', 'preview-element ' + element.className);
            
            var $codeOutput = this.$('.code-output');
            var classes = element.className.split(' ').filter(function (cls) {
                return cls.trim() !== '';
            });
            
            var html = '<div class="' + classes.join(' ') + '">\n  Content\n</div>';
            $codeOutput.html(this._highlightCode(html));
        },

        /**
         * Handle class button click
         */
        _onClassButtonClick: function (event) {
            var $btn = $(event.currentTarget);
            var className = $btn.data('class');
            
            if (this.selectedElement) {
                this._toggleClass(this.selectedElement, className);
                $btn.toggleClass('active');
                this._updatePreview(this.selectedElement);
            }
        },

        /**
         * Handle utility search
         */
        _onUtilitySearch: function (event) {
            var query = $(event.currentTarget).val().toLowerCase();
            var $items = this.$('.utility-item');
            
            $items.each(function () {
                var $item = $(this);
                var className = $item.find('.class-name').text().toLowerCase();
                var description = $item.find('.description').text().toLowerCase();
                
                if (className.includes(query) || description.includes(query)) {
                    $item.show();
                } else {
                    $item.hide();
                }
            });
        },

        /**
         * Handle utility item click
         */
        _onUtilityItemClick: function (event) {
            var $item = $(event.currentTarget);
            var className = $item.data('class');
            
            if (this.selectedElement) {
                this._toggleClass(this.selectedElement, className);
                this._updatePreview(this.selectedElement);
            }
        },

        /**
         * Handle color swatch click
         */
        _onColorSwatchClick: function (event) {
            var $swatch = $(event.currentTarget);
            var colorClass = $swatch.data('color');
            
            this.$('.color-swatch').removeClass('selected');
            $swatch.addClass('selected');
            
            if (this.selectedElement) {
                // Remove existing color classes of the same type
                var classType = colorClass.split('-')[0]; // bg, text, border, etc.
                this._removeClassesByPrefix(this.selectedElement, classType + '-');
                
                // Add new color class
                this._addClass(this.selectedElement, colorClass);
                this._updatePreview(this.selectedElement);
            }
        },

        /**
         * Handle spacing change
         */
        _onSpacingChange: function (event) {
            var $input = $(event.currentTarget);
            var property = $input.data('property');
            var value = $input.val();
            var className = property + '-' + value;
            
            $input.siblings('.value').text(value);
            
            if (this.selectedElement) {
                this._removeClassesByPrefix(this.selectedElement, property + '-');
                this._addClass(this.selectedElement, className);
                this._updatePreview(this.selectedElement);
            }
        },

        /**
         * Handle typography change
         */
        _onTypographyChange: function (event) {
            var $select = $(event.currentTarget);
            var property = $select.data('property');
            var value = $select.val();
            var className = property + '-' + value;
            
            if (this.selectedElement) {
                this._removeClassesByPrefix(this.selectedElement, property + '-');
                this._addClass(this.selectedElement, className);
                this._updatePreview(this.selectedElement);
            }
        },

        /**
         * Handle layout option click
         */
        _onLayoutOptionClick: function (event) {
            var $option = $(event.currentTarget);
            var layout = $option.data('layout');
            
            this.$('.layout-option').removeClass('selected');
            $option.addClass('selected');
            
            if (this.selectedElement) {
                // Remove existing layout classes
                this._removeClassesByPrefix(this.selectedElement, 'flex');
                this._removeClassesByPrefix(this.selectedElement, 'grid');
                this._removeClassesByPrefix(this.selectedElement, 'block');
                this._removeClassesByPrefix(this.selectedElement, 'inline');
                
                // Add new layout class
                this._addClass(this.selectedElement, layout);
                this._updatePreview(this.selectedElement);
            }
        },

        /**
         * Handle breakpoint tab click
         */
        _onBreakpointTabClick: function (event) {
            var $tab = $(event.currentTarget);
            var breakpoint = $tab.data('breakpoint');
            
            this.$('.breakpoint-tab').removeClass('active');
            $tab.addClass('active');
            
            this.currentBreakpoint = breakpoint;
            this._updatePanelForBreakpoint(breakpoint);
        },

        /**
         * Update panel for breakpoint
         */
        _updatePanelForBreakpoint: function (breakpoint) {
            // Update class buttons to show breakpoint-specific classes
            var prefix = breakpoint === 'base' ? '' : breakpoint + ':';
            
            this.$('.tailwind-class-btn').each(function () {
                var $btn = $(this);
                var baseClass = $btn.data('base-class') || $btn.data('class');
                var newClass = prefix + baseClass;
                $btn.data('class', newClass);
                $btn.find('.class-text').text(newClass);
            });
        },

        /**
         * Toggle class on element
         */
        _toggleClass: function (element, className) {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            } else {
                element.classList.add(className);
            }
        },

        /**
         * Add class to element
         */
        _addClass: function (element, className) {
            element.classList.add(className);
        },

        /**
         * Remove classes by prefix
         */
        _removeClassesByPrefix: function (element, prefix) {
            var classes = Array.from(element.classList);
            classes.forEach(function (cls) {
                if (cls.startsWith(prefix)) {
                    element.classList.remove(cls);
                }
            });
        },

        /**
         * Check if class is a Tailwind class
         */
        _isTailwindClass: function (className) {
            var tailwindPrefixes = [
                'bg-', 'text-', 'border-', 'p-', 'm-', 'px-', 'py-', 'mx-', 'my-',
                'w-', 'h-', 'flex', 'grid', 'block', 'inline', 'hidden', 'rounded',
                'shadow', 'font-', 'leading-', 'tracking-', 'space-', 'divide-'
            ];
            
            return tailwindPrefixes.some(function (prefix) {
                return className.startsWith(prefix);
            });
        },

        /**
         * Get utility classes list
         */
        _getUtilityClasses: function () {
            return [
                { class: 'flex', description: 'Display flex' },
                { class: 'grid', description: 'Display grid' },
                { class: 'block', description: 'Display block' },
                { class: 'hidden', description: 'Display none' },
                { class: 'text-center', description: 'Text align center' },
                { class: 'text-left', description: 'Text align left' },
                { class: 'text-right', description: 'Text align right' },
                { class: 'bg-blue-500', description: 'Blue background' },
                { class: 'text-white', description: 'White text' },
                { class: 'p-4', description: 'Padding 1rem' },
                { class: 'm-4', description: 'Margin 1rem' },
                { class: 'rounded', description: 'Border radius' },
                { class: 'shadow', description: 'Box shadow' },
                // Add more utility classes as needed
            ];
        },

        /**
         * Get color palette
         */
        _getColorPalette: function () {
            return [
                { name: 'Blue 500', class: 'bg-blue-500', value: '#3b82f6' },
                { name: 'Red 500', class: 'bg-red-500', value: '#ef4444' },
                { name: 'Green 500', class: 'bg-green-500', value: '#10b981' },
                { name: 'Yellow 500', class: 'bg-yellow-500', value: '#eab308' },
                { name: 'Purple 500', class: 'bg-purple-500', value: '#8b5cf6' },
                { name: 'Gray 500', class: 'bg-gray-500', value: '#6b7280' },
                // Add more colors as needed
            ];
        },

        /**
         * Highlight code syntax
         */
        _highlightCode: function (code) {
            return code
                .replace(/class="/g, '<span class="keyword">class</span>="')
                .replace(/"([^"]+)"/g, '"<span class="string">$1</span>"')
                .replace(/&lt;(\w+)/g, '&lt;<span class="class">$1</span>');
        },
    });

    // Register the editor panel with website editor
    websiteNavbarData.websiteNavbarRegistry.add(TailwindEditorPanel, '.o_we_tailwind_panel');

    return TailwindEditorPanel;
});
