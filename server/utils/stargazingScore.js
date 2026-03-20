function calculateScore(cloud, illumination) {
    let score = 5;

    if(cloud > 80) score = 1;
    else if (cloud > 60) score = 2;
    else if (cloud > 40) score = 3;
    else if (cloud > 20) score = 4;

    if(illumination > 70) score -= 1;
    if(illumination > 90) score -= 1;

    return Math.max(1, score);
}

module.exports = { calculateScore};