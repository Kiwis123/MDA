package bupt.edu.cn.web.algorithm;

/**
 * @description:
 * @author: tc
 * @create: 2020/11/17 12:49
 */
public class Location {
    // store the Location in an array to accommodate multi-dimensional problem space
    private double[] loc;

    public Location(double[] loc) {
        super();
        this.loc = loc;
    }

    public double[] getLoc() {
        return loc;
    }

    public void setLoc(double[] loc) {
        this.loc = loc;
    }

}
