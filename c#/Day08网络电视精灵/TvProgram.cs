using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Day08网络电视精灵
{
    /// <summary>
    /// 节目对象
    /// </summary>
    public class TvProgram
    {
        #region 属性

        /// <summary>
        /// 播出时间
        /// </summary>
        private DateTime playTime;
        public DateTime PlayTime
        {
            get { return playTime; }
            set { playTime = value; }
        }
        /// <summary>
        /// 时段
        /// </summary>
        private string median;
        public string Median
        {
            get { return median; }
            set { median = value; }
        }
        /// <summary>
        /// 名称
        /// </summary>
        private string programName;
        public string ProgramName
        {
            get { return programName; }
            set { programName = value; }
        }
        /// <summary>
        /// 文件路径
        /// </summary>
        private string filePath;
        public string FilePath
        {
            get { return filePath; }
            set { filePath = value; }
        }
        #endregion

    }
}
