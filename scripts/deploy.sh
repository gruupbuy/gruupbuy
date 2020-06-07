#!/usr/bin/env bash
source ~/.bash_profile
production=false
beta=false
function show_help {
    echo "Default deploys to dev.medinas.com.  Use -p for production, -b for beta"
    exit 1;
}
# Check if config.env exists
filename="./config.env"
if [ ! -f ${filename} ]; then
    echo "Please copy sample.config.env to config.env and set your AWS credentials!"
fi
while getopts "h?pb" opt; do
    case "$opt" in
    h|\?)
        show_help
        exit 0
        ;;
    p)  production=true
        ;;
    b)  beta=true
        ;;
    esac
done
# Read in the config.env and set AWS keys accordingly
while IFS='' read -r line || [[ -n "$line" ]]; do
    export $line
done < "$filename"

echo "Pushing to production!"
aws s3 cp dist/ s3://forbes-hackathon/ --recursive --acl public-read --cache-control max-age=0
aws cloudfront create-invalidation --distribution-id E4W5MNARV6S7O --paths "/*"
