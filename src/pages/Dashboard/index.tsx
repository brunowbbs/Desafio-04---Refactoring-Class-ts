import { useEffect, useState } from "react";
import Food from "../../components/Food";
import Header from "../../components/Header";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import api from "../../services/api";
import { FoodsContainer } from "./styles";

export interface FoodProps {
  id: number;
  available: boolean;
  description: string;
  image: string;
  name: string;
  price: string;
}

export type FoodInputProps = Omit<FoodProps, "id">;

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState({} as FoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get<FoodProps[]>("/foods");
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  const handleAddFood = async (food: FoodInputProps) => {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodProps) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods?.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );
      setFoods(foodsUpdated);
      setEditModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);
    setFoods(foodsFiltered);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: FoodProps) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
