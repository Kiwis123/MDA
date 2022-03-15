package bupt.edu.cn.web.algorithm;

/**
 * @description:
 * @author: tc
 * @create: 2020/11/17 12:56
 */
public class PSOUtility {
    public static int getMinPos(double[] list) {
        int pos = 0;
        double minValue = list[0];

        for(int i=0; i<list.length; i++) {
            if(list[i] < minValue) {
                pos = i;
                minValue = list[i];
            }
        }

        return pos;
    }
}
