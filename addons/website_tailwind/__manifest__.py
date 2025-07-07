{
    'name': 'Website Tailwind CSS Integration',
    'version': '18.0.1.0.0',
    'category': 'Website',
    'summary': 'Integrate Tailwind CSS with Odoo Website module alongside Bootstrap',
    'description': """
Website Tailwind CSS Integration
================================

This module integrates Tailwind CSS with the Odoo Website module while maintaining
Bootstrap compatibility. It provides:

* Tailwind CSS framework integration
* Custom utility classes
* Bootstrap compatibility layer
* Responsive design utilities
* Custom component styles

Features:
---------
* Seamless integration with existing Bootstrap components
* Tailwind utility classes for rapid development
* Custom CSS compilation pipeline
* Responsive design utilities
* Performance optimized CSS delivery

Installation:
-------------
1. Install the module
2. Compile Tailwind CSS using npm run build
3. Refresh your website to see Tailwind classes available

Usage:
------
You can now use Tailwind utility classes in your website templates:
- Text utilities: text-center, text-lg, text-blue-500
- Layout utilities: flex, grid, container
- Spacing utilities: p-4, m-2, space-x-4
- And many more...

The module ensures Bootstrap and Tailwind work together without conflicts.
    """,
    'author': 'Arihant AI',
    'website': 'https://arihantai.com',
    'depends': ['website', 'web'],
    'data': [
        'views/assets.xml',
        'data/website_data.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'website_tailwind/static/src/css/tailwind.css',
            'website_tailwind/static/src/css/tailwind-bootstrap-compat.css',
            'website_tailwind/static/src/js/tailwind-init.js',
        ],
        'web.assets_backend': [
            'website_tailwind/static/src/css/tailwind-backend.css',
        ],
        'website.assets_editor': [
            'website_tailwind/static/src/css/tailwind-editor.css',
            'website_tailwind/static/src/js/tailwind-editor.js',
        ],
    },
    'installable': True,
    'auto_install': False,
    'application': False,
    'license': 'LGPL-3',
}
