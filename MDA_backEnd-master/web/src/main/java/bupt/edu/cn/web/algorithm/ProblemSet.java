package bupt.edu.cn.web.algorithm;

/**
 * @description:
 * @author: tc
 * @create: 2020/11/17 12:53
 */
public class ProblemSet {
    public static final double LOC_X_LOW = 1;
    public static final double LOC_X_HIGH = 4;
    public static final double LOC_Y_LOW = -1;
    public static final double LOC_Y_HIGH = 1;
    public static final double VEL_LOW = -1;
    public static final double VEL_HIGH = 1;

    public static final double ERR_TOLERANCE = 1E-20; // the smaller the tolerance, the more accurate the result,
    // but the number of iteration is increased

    public static double evaluate(Location location) {
        double result = 0;
        double x = location.getLoc()[0]; // the "x" part of the location
        double y = location.getLoc()[1]; // the "y" part of the location

        result = Math.pow(2.8125 - x + x * Math.pow(y, 4), 2) +
                Math.pow(2.25 - x + x * Math.pow(y, 2), 2) +
                Math.pow(1.5 - x + x * y, 2);

        return result;
    }
}
