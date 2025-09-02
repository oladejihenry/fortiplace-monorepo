#!/bin/bash
# Make sure this file has executable permissions, run `chmod +x run-nightwatch.sh`

# This command runs the nightwatch agent.
php artisan nightwatch:agent --listen-on=0.0.0.0:2407