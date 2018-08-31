const optimizely = require('@optimizely/optimizely-sdk'); // Optimizely SDK for client instantiation
const getRandomHash = require('../get-random-hash'); // Custom service

const getVariation = (expressMiddleware, datafile) => {
    
    // Instantiate Optimizely client 
    const optimizelyClient = optimizely.createInstance({ datafile });

    // Layer to add to middleware stack
    expressMiddleware.use((req, res, next) => {
        const experimentKey = 'simon-fullstack-example';
        const optimizely_user_id = req.cookies.optimizely_user_id || getRandomHash(); // If cookie doesn't exist, generate random hash.
        const attributes = {
            url: req.originalrl
        }

        res.cookie('optimizely_user_id', optimizely_user_id);  // Set cookie value with generated value
        // req.optimizely_bucket_id = optimizely_bucket_id; // Set cookie value to request object ?? Need this??

        const variation = optimizelyClient.activate(experimentKey, optimizely_user_id, attributes); // Activate A/B test for user
        res.locals.variation = variation; // Initialize to locals object for res object so middleware functions can access it

        next();
    });

}

module.exports = getVariation;