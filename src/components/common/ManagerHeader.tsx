import { motion } from "framer-motion";

const ManagerHeader = ({ activeTab, tabs }) => {
  return (
    <header className="bg-white border-b">
      <div className="flex justify-between items-center h-16 px-8">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
          </motion.div>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <div className="text-sm text-gray-500">
            الرئيسية / {tabs.find((tab) => tab.id === activeTab)?.label}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;
