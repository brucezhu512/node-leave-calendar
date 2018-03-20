mkdir -p ./public/scripts
cp -v ./node_modules/bootstrap/dist/js/bootstrap.min.* \
      ./node_modules/jquery/dist/jquery.min.* \
      ./node_modules/popper.js/dist/popper.min.* \
      ./node_modules/feather-icons/dist/feather.min.* \
      ./node_modules/chart.js/dist/Chart.min.* \
      ./public/scripts/

mkdir -p ./public/stylesheets
cp -v ./node_modules/bootstrap/dist/css/bootstrap.min.* \
      ./public/stylesheets/
