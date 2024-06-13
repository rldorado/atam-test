const { MAX_MULTIPLIER, MIN_MULTIPLIER } = require('./constants');

/**
 * Cálculos de aumento para descriptores de datos.
 * 
 * @param {Array} dataDescriptors - Lista de descriptores de datos.
 * @param {Array} calculationsQueue - Cola de funciones de cálculo.
 * @param {Object} database - Objeto de base de datos con el método save.
 * @param {number} multiplier - Multiplicador utilizado en los cálculos.
 */
const prepareRaiseCalculations = (dataDescriptors, calculationsQueue, database, multiplier) => {
    for (let i = 0; i < dataDescriptors.length; i++) {
        let dataDescriptor = dataDescriptors[i];
        
        calculationsQueue.push(() => {
            try {
                if (dataDescriptor.type == 'foo') {
                    dataDescriptor.cachedValue = dataDescriptor.cachedValue * Math.max(MAX_MULTIPLIER, multiplier);
                } else {
                    dataDescriptor.cachedValue = dataDescriptor.cachedValue *  Math.min(multiplier, MIN_MULTIPLIER);
                }
                database.save(dataDescriptor);
            } catch (error) {
                console.error("Error saving dataDescriptor:", error);
            };
        });
    }
}

module.exports = prepareRaiseCalculations;