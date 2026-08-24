import React from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useReportScreen } from "./useReportScreen";
import { styles } from "./ReportScreen.styles";

export default function ReportScreen() {
  const {
    source,
    name,
    brand,
    cantidad,
    imageUrl,
    quantityNum,
    quantityUnit,
    sugars100,
    fat100,
    satFat100,
    salt100,
    sugarLevel,
    fatLevel,
    sodiumLevel,
    portionLabel,
    sugarPerPortion,
    teaspoons,
    showFatDetails,
    setShowFatDetails,
    showSaltDetails,
    setShowSaltDetails,
    getBadgeColor,
    translateLevel,
    goBack,
  } = useReportScreen();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Encabezado del Producto con Imagen */}
      <View style={styles.headerCard}>
        <Text style={styles.sourceTag}>
          {source === "local"
            ? "🟢 Base de Datos Nutri-Check"
            : "🔵 Open Food Facts"}
        </Text>
        <View style={styles.productRow}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={{ fontSize: 24 }}>📦</Text>
            </View>
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{name}</Text>
            <Text style={styles.productBrand}>Marca: {brand}</Text>
            <Text style={styles.productBrand}>Cantidad: {cantidad}</Text>            
            {quantityNum > 0 && (
              <Text style={styles.productQuantity}>
                Contenido: {quantityNum} {quantityUnit}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Evaluación por Semáforo con Gramos */}
      <Text style={styles.sectionTitle}>Evaluación por Semáforo</Text>
      <View style={styles.semaphoreContainer}>
        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Azúcares</Text>
          <Text style={styles.gramText}>
            {sugars100}g / 100{quantityUnit}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getBadgeColor(sugarLevel).bg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getBadgeColor(sugarLevel).text },
              ]}
            >
              {translateLevel(sugarLevel)}
            </Text>
          </View>
        </View>

        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Grasas Sat.</Text>
          <Text style={styles.gramText}>
            {satFat100}g / 100{quantityUnit}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getBadgeColor(fatLevel).bg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getBadgeColor(fatLevel).text },
              ]}
            >
              {translateLevel(fatLevel)}
            </Text>
          </View>
        </View>

        <View style={styles.nutrientCard}>
          <Text style={styles.nutrientLabel}>Sodio/Sal</Text>
          <Text style={styles.gramText}>
            {salt100}g / 100{quantityUnit}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getBadgeColor(sodiumLevel).bg },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getBadgeColor(sodiumLevel).text },
              ]}
            >
              {translateLevel(sodiumLevel)}
            </Text>
          </View>
        </View>
      </View>

      {/* Equivalencia Pedagógica de Azúcar */}
      <View style={styles.educationalCard}>
        <Text style={styles.educationalTitle}>💡 Equivalencia en Azúcar</Text>
        <Text style={styles.educationalText}>
          Por cada <Text style={{ fontWeight: "700" }}>{sugars100 + "g"}</Text>,
          de azúcar.
        </Text>
         {/* <Text style={styles.educationalText}>
          Por cada <Text style={{ fontWeight: "700" }}>{portionLabel}</Text>,
          de {name} contiene aprox.{" "}
          <Text style={{ fontWeight: "700", color: "#FF3B30" }}>
            {sugarPerPortion} g de azúcar.
          </Text>
        </Text> */}
        <View style={styles.spoonRow}>
          <Text style={styles.spoonText}>
            Equivale a:{" "}
            {teaspoons > 0
              ? "🥄 ".repeat(Math.min(teaspoons, 8))
              : "0 cucharaditas"}{" "}
            ({teaspoons} tbsp)
          </Text>
        </View>
      </View>

      {/* Sección Grasas Totales Desplegable */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setShowFatDetails(!showFatDetails)}
      >
        <View style={styles.expandableHeader}>
          <Text style={styles.expandableTitle}>
            🧈 Grasas Totales ({fat100} g / 100{quantityUnit})
          </Text>
          <Text style={styles.arrow}>{showFatDetails ? "▲" : "▼"}</Text>
        </View>

        {showFatDetails && (
          <View style={styles.expandableContent}>
            <Text style={styles.fatItem}>
              🟢 <Text style={styles.bold}>Grasas monoinsaturadas:</Text>{" "}
              Principalmente ácido oleico.
            </Text>
            <Text style={styles.fatItem}>
              🟢 <Text style={styles.bold}>Grasas poliinsaturadas:</Text>{" "}
              Omega-6 y pequeñas cantidades de Omega-3.
            </Text>
            <Text style={styles.fatItem}>
              🟠{" "}
              <Text style={styles.bold}>Grasas saturadas ({satFat100} g):</Text>{" "}
              Su consumo excesivo eleva el colesterol LDL ("malo") y aumenta el
              riesgo cardiovascular.
            </Text>
            <Text style={styles.fatItem}>
              ⚪ <Text style={styles.bold}>Grasas trans:</Text> Grasas dañinas
              que elevan el colesterol malo y reducen el bueno, elevando el
              riesgo cardiovascular.
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Sección Sodio / Sal OMS */}
      <TouchableOpacity
        style={styles.expandableCard}
        onPress={() => setShowSaltDetails(!showSaltDetails)}
      >
        <View style={styles.expandableHeader}>
          <Text style={styles.expandableTitle}>
            🧂 Información de Sal y Sodio
          </Text>
          <Text style={styles.arrow}>{showSaltDetails ? "▲" : "▼"}</Text>
        </View>

        {showSaltDetails && (
          <View style={styles.expandableContent}>
            <Text style={styles.infoSubtitle}>¿Qué necesitas saber?</Text>
            <Text style={styles.bulletPoint}>
              • Un alto consumo de sal (o sodio) puede provocar un aumento de la
              presión arterial y el riesgo de enfermedades cardiovasculares.
            </Text>
            <Text style={styles.bulletPoint}>
              • Muchas personas con presión alta no lo saben, ya que no presenta
              síntomas previos.
            </Text>
            <Text style={styles.bulletPoint}>
              • La mayoría de las personas consumen de 9 a 12 g diarios de sal,
              el doble del límite recomendado (5 g/día según la OMS).
            </Text>
            <Text style={styles.sourceText}>
              Fuente: OMS (World Health Organization) / NHS UK
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Botón Volver */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Escanear otro producto 🔍</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
