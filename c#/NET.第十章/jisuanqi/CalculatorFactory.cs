using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace jisuanqi
{
    public class CalculatorFactory
    {
        public static count getInstance(string oper)
        {

            count co = null;
            switch (oper)
            {
                case "+":
                    co = new Add();
                    break;
                case "-":
                    co = new jian();
                    break;
                case "*":
                    co = new cheng();
                    break;

                case "/":
                    co = new chu();
                    break;
               
            }
            return co;
        }


    }

}
